// ============================================================
// VentaRepository — Acceso a datos con transacciones atómicas
// HU-07 & HU-08
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------
  // HU-07: Crear venta con detalles y reducir stock.
  // Todo ocurre dentro de una única transacción: si cualquier
  // operación falla, Prisma hace rollback completo.
  // ----------------------------------------------------------
  async createWithDetalles(dto: CreateVentaDto, total: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear la cabecera de la venta
      const venta = await tx.venta.create({
        data: { total },
        // fecha usa @default(now()) del schema
      });

      // 2. Crear todos los detalles de la venta en bloque
      await tx.detalleVenta.createMany({
        data: dto.detalles.map((d) => ({
          ventaId: venta.id,
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })),
      });

      // 3. Reducir el stock de cada producto de forma atómica.
      //    Usamos Promise.all para que sean paralelas pero dentro
      //    de la misma transacción, garantizando consistencia.
      await Promise.all(
        dto.detalles.map((d) =>
          tx.producto.update({
            where: { id: d.productoId },
            data: { stock: { decrement: d.cantidad } },
          }),
        ),
      );

      // 4. Retornar la venta con todos sus detalles y relaciones
      return tx.venta.findUnique({
        where: { id: venta.id },
        include: {
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
  // HU-08: Listar ventas con paginación.
  // Ordena por fecha descendente (ventas más recientes primero).
  // ----------------------------------------------------------
  async findAll(skip: number, take: number) {
    const [data, total] = await Promise.all([
      this.prisma.venta.findMany({
        skip,
        take,
        orderBy: { fecha: 'desc' },
        include: {
          detalles: {
            include: {
              producto: {
                select: { id: true, nombre: true, codigo: true },
              },
            },
          },
        },
      }),
      this.prisma.venta.count(),
    ]);

    return { data, total };
  }

  // ----------------------------------------------------------
  // HU-08: Obtener una venta por ID con detalle completo
  // ----------------------------------------------------------
  async findOne(id: number) {
    return this.prisma.venta.findUnique({
      where: { id },
      include: {
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
