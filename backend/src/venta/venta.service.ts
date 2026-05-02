// ============================================================
// VentaService — Lógica de negocio de ventas
// HU-07 & HU-08
// ============================================================

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { VentaRepository } from './venta.repository';
import { CreateVentaDto } from './dto/create-venta.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VentaService {
  constructor(
    private readonly ventaRepo: VentaRepository,
    // Inyectamos PrismaService para validaciones de integridad previas
    private readonly prisma: PrismaService,
  ) {}

  // ----------------------------------------------------------
  // HU-07: Registrar venta
  //  1. Validar que no haya productos duplicados en el detalle
  //  2. Validar que cada producto exista
  //  3. Validar que hay stock suficiente para cada producto
  //  4. Calcular total (servidor — nunca confiar en el cliente)
  //  5. Delegar al repository (transacción atómica)
  // ----------------------------------------------------------
  async create(dto: CreateVentaDto) {
    // 1. Detectar productos duplicados en el detalle de la misma venta
    const productosIds = dto.detalles.map((d) => d.productoId);
    const duplicados = productosIds.filter(
      (id, index) => productosIds.indexOf(id) !== index,
    );
    if (duplicados.length > 0) {
      throw new BadRequestException(
        `El detalle tiene productos duplicados (IDs: ${[...new Set(duplicados)].join(', ')}). Consolida las cantidades en una sola línea.`,
      );
    }

    // 2. Verificar que cada producto del detalle existe en la BD
    const productosEnBD = await this.prisma.producto.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, nombre: true, stock: true },
    });
    const idsEncontrados = productosEnBD.map((p) => p.id);
    const idsNoEncontrados = productosIds.filter(
      (id) => !idsEncontrados.includes(id),
    );
    if (idsNoEncontrados.length > 0) {
      throw new NotFoundException(
        `Los siguientes productos no existen: IDs [${idsNoEncontrados.join(', ')}]`,
      );
    }

    // 3. Validar stock disponible para cada producto
    const sinStock: string[] = [];
    for (const detalle of dto.detalles) {
      const producto = productosEnBD.find((p) => p.id === detalle.productoId);
      if (producto && detalle.cantidad > producto.stock) {
        sinStock.push(
          `"${producto.nombre}" (stock: ${producto.stock}, solicitado: ${detalle.cantidad})`,
        );
      }
    }
    if (sinStock.length > 0) {
      throw new BadRequestException(
        `Stock insuficiente para: ${sinStock.join(', ')}`,
      );
    }

    // 4. Calcular total en el servidor (suma de cantidad × precioUnitario)
    //    Se usa round a 4 decimales para evitar errores de punto flotante
    const total = parseFloat(
      dto.detalles
        .reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0)
        .toFixed(4),
    );

    // 5. Persistir en transacción atómica
    return this.ventaRepo.createWithDetalles(dto, total);
  }

  // ----------------------------------------------------------
  // HU-08: Listar ventas con paginación
  // ----------------------------------------------------------
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.ventaRepo.findAll(skip, limit);
  }

  // ----------------------------------------------------------
  // HU-08: Obtener venta por ID con detalle completo
  // ----------------------------------------------------------
  async findOne(id: number) {
    const venta = await this.ventaRepo.findOne(id);
    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no existe`);
    }
    return venta;
  }
}
