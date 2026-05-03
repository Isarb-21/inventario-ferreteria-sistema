// ============================================================
// DetalleCompraService — Lógica de consulta de detalles de compra
// HU-05/06: Los detalles se crean implícitamente en CompraRepository.
// Este módulo expone endpoints de solo consulta (inmutabilidad).
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DetalleCompraService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------
  // Obtener todos los detalles de compra
  // ----------------------------------------------------------
  async findAll() {
    return this.prisma.detalleCompra.findMany({
      include: {
        compra: {
          select: {
            id: true,
            fecha: true,
            total: true,
            proveedor: { select: { id: true, nombre: true } },
          },
        },
        producto: {
          select: { id: true, nombre: true, codigo: true, precioCompra: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  // ----------------------------------------------------------
  // Obtener detalles de una compra específica
  // ----------------------------------------------------------
  async findByCompra(compraId: number) {
    const compra = await this.prisma.compra.findUnique({
      where: { id: compraId },
    });
    if (!compra) {
      throw new NotFoundException(`La compra con ID ${compraId} no existe`);
    }

    return this.prisma.detalleCompra.findMany({
      where: { compraId },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            precioCompra: true,
            stock: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  // ----------------------------------------------------------
  // Obtener un detalle de compra por ID
  // ----------------------------------------------------------
  async findOne(id: number) {
    const detalle = await this.prisma.detalleCompra.findUnique({
      where: { id },
      include: {
        compra: {
          select: {
            id: true,
            fecha: true,
            total: true,
            proveedor: { select: { id: true, nombre: true } },
          },
        },
        producto: {
          select: { id: true, nombre: true, codigo: true, precioCompra: true },
        },
      },
    });
    if (!detalle) {
      throw new NotFoundException(
        `El detalle de compra con ID ${id} no existe`,
      );
    }
    return detalle;
  }
}
