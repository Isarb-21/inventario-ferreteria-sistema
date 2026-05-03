// ============================================================
// DetalleVentaService — Lógica de consulta de detalles de venta
// HU-08: Los detalles se crean implícitamente en VentaService.
// Este módulo expone endpoints de solo consulta (inmutabilidad).
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------
  // Obtener todos los detalles de venta (con relaciones)
  // ----------------------------------------------------------
  async findAll() {
    return this.prisma.detalleVenta.findMany({
      include: {
        venta: { select: { id: true, fecha: true, total: true } },
        producto: {
          select: { id: true, nombre: true, codigo: true, precioVenta: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  // ----------------------------------------------------------
  // Obtener detalles de una venta específica por ventaId
  // ----------------------------------------------------------
  async findByVenta(ventaId: number) {
    // Verificar que la venta existe
    const venta = await this.prisma.venta.findUnique({
      where: { id: ventaId },
    });
    if (!venta) {
      throw new NotFoundException(`La venta con ID ${ventaId} no existe`);
    }

    return this.prisma.detalleVenta.findMany({
      where: { ventaId },
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
    });
  }

  // ----------------------------------------------------------
  // Obtener un detalle de venta por ID
  // ----------------------------------------------------------
  async findOne(id: number) {
    const detalle = await this.prisma.detalleVenta.findUnique({
      where: { id },
      include: {
        venta: { select: { id: true, fecha: true, total: true } },
        producto: {
          select: { id: true, nombre: true, codigo: true, precioVenta: true },
        },
      },
    });
    if (!detalle) {
      throw new NotFoundException(
        `El detalle de venta con ID ${id} no existe`,
      );
    }
    return detalle;
  }
}
