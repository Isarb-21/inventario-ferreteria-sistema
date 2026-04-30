// ============================================================
// CompraService — Lógica de negocio de compras
// HU-05 & HU-06
// ============================================================

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CompraRepository } from './compra.repository';
import { CreateCompraDto } from './dto/create-compra.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompraService {
  constructor(
    private readonly compraRepo: CompraRepository,
    // Inyectamos PrismaService para validaciones de integridad previas
    private readonly prisma: PrismaService,
  ) {}

  // ----------------------------------------------------------
  // HU-05: Registrar compra
  //  1. Validar que el proveedor exista
  //  2. Validar que no haya productos duplicados en el detalle
  //  3. Validar que cada producto exista
  //  4. Calcular total (servidor — nunca confiar en el cliente)
  //  5. Delegar al repository (transacción atómica)
  // ----------------------------------------------------------
  async create(dto: CreateCompraDto) {
    // 1. Verificar que el proveedor existe
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: dto.proveedorId },
    });
    if (!proveedor) {
      throw new NotFoundException(
        `El proveedor con ID ${dto.proveedorId} no existe`,
      );
    }

    // 2. Detectar productos duplicados en el detalle de la misma compra
    const productosIds = dto.detalles.map((d) => d.productoId);
    const duplicados = productosIds.filter(
      (id, index) => productosIds.indexOf(id) !== index,
    );
    if (duplicados.length > 0) {
      throw new BadRequestException(
        `El detalle tiene productos duplicados (IDs: ${[...new Set(duplicados)].join(', ')}). Consolida las cantidades en una sola línea.`,
      );
    }

    // 3. Verificar que cada producto del detalle existe en la BD
    const productosEnBD = await this.prisma.producto.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, nombre: true },
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

    // 4. Calcular total en el servidor (suma de cantidad × precioUnitario)
    //    Se usa round a 4 decimales para evitar errores de punto flotante
    const total = parseFloat(
      dto.detalles
        .reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0)
        .toFixed(4),
    );

    // 5. Persistir en transacción atómica
    return this.compraRepo.createWithDetalles(dto, total);
  }

  // ----------------------------------------------------------
  // HU-05 & HU-06: Listar con paginación y filtro opcional
  // ----------------------------------------------------------
  async findAll(page: number = 1, limit: number = 10, proveedorId?: number) {
    // Validar que si viene proveedorId, el proveedor exista
    if (proveedorId !== undefined) {
      const proveedor = await this.prisma.proveedor.findUnique({
        where: { id: proveedorId },
      });
      if (!proveedor) {
        throw new NotFoundException(
          `El proveedor con ID ${proveedorId} no existe`,
        );
      }
    }

    const skip = (page - 1) * limit;
    return this.compraRepo.findAll(skip, limit, proveedorId);
  }

  // ----------------------------------------------------------
  // HU-05: Obtener compra por ID con detalle completo
  // ----------------------------------------------------------
  async findOne(id: number) {
    const compra = await this.compraRepo.findOne(id);
    if (!compra) {
      throw new NotFoundException(`La compra con ID ${id} no existe`);
    }
    return compra;
  }
}
