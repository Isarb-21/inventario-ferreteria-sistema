// ============================================================
// CompraRepository — Acceso a datos con transacciones atómicas
// HU-05 & HU-06
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class CompraRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------
  // HU-05: Crear compra con detalles y actualizar stock.
  // Todo ocurre dentro de una única transacción: si cualquier
  // operación falla, Prisma hace rollback completo.
  // ----------------------------------------------------------
  async createWithDetalles(dto: CreateCompraDto, total: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear la cabecera de la compra
      const compra = await tx.compra.create({
        data: {
          proveedorId: dto.proveedorId,
          total,
          // Si el cliente envió fecha la usamos; si no, Prisma usa @default(now())
          ...(dto.fecha ? { fecha: new Date(dto.fecha) } : {}),
        },
      });

      // 2. Crear todos los detalles de la compra en bloque
      await tx.detalleCompra.createMany({
        data: dto.detalles.map((d) => ({
          compraId: compra.id,
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })),
      });

      // 3. Incrementar el stock de cada producto de forma atómica.
      //    Usamos Promise.all para que sean paralelas pero dentro
      //    de la misma transacción, garantizando consistencia.
      await Promise.all(
        dto.detalles.map((d) =>
          tx.producto.update({
            where: { id: d.productoId },
            data: { stock: { increment: d.cantidad } },
          }),
        ),
      );

      // 4. Retornar la compra con todos sus detalles y relaciones
      return tx.compra.findUnique({
        where: { id: compra.id },
        include: {
          proveedor: {
            select: { id: true, nombre: true, nit: true },
          },
          detalles: {
            include: {
              producto: {
                select: { id: true, nombre: true, codigo: true },
              },
            },
          },
        },
      });
    });
  }

  // ----------------------------------------------------------
  // HU-05 & HU-06: Listar compras con paginación y filtro
  // opcional por proveedorId. Ordena por fecha descendente.
  // ----------------------------------------------------------
  async findAll(skip: number, take: number, proveedorId?: number) {
    const where = proveedorId ? { proveedorId } : {};

    const [data, total] = await Promise.all([
      this.prisma.compra.findMany({
        skip,
        take,
        where,
        orderBy: { fecha: 'desc' },
        include: {
          proveedor: {
            select: { id: true, nombre: true, nit: true },
          },
          detalles: {
            include: {
              producto: {
                select: { id: true, nombre: true, codigo: true },
              },
            },
          },
        },
      }),
      this.prisma.compra.count({ where }),
    ]);

    return { data, total };
  }

  // ----------------------------------------------------------
  // HU-05: Obtener una compra por ID con detalle completo
  // ----------------------------------------------------------
  async findOne(id: number) {
    return this.prisma.compra.findUnique({
      where: { id },
      include: {
        proveedor: {
          select: { id: true, nombre: true, nit: true, telefono: true, correo: true },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
                precioVenta: true,
                stock: true,
              },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    });
  }
}
