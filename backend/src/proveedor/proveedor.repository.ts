import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class ProveedorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.proveedor.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.proveedor.findUnique({
      where: { id },
      include: {
        compras: { take: 1 }, // Para verificar si tiene compras asociadas
      },
    });
  }

  async findWithProductos(id: number) {
    return this.prisma.proveedor.findUnique({
      where: { id },
      include: {
        proveedorProductos: {
          include: {
            producto: {
              include: { categoria: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        compras: { take: 1 },
      },
    });
  }

  async findProductos(id: number) {
    return this.prisma.proveedorProducto.findMany({
      where: { proveedorId: id },
      include: {
        producto: {
          include: { categoria: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async asociarProducto(proveedorId: number, productoId: number) {
    return this.prisma.proveedorProducto.upsert({
      where: { proveedorId_productoId: { proveedorId, productoId } },
      create: { proveedorId, productoId },
      update: {},
    });
  }

  async desasociarProducto(proveedorId: number, productoId: number) {
    return this.prisma.proveedorProducto.delete({
      where: { proveedorId_productoId: { proveedorId, productoId } },
    });
  }

  async findByNit(nit: string) {
    return this.prisma.proveedor.findUnique({ where: { nit } });
  }

  async create(data: Prisma.ProveedorUncheckedCreateInput) {
    return this.prisma.proveedor.create({ data });
  }

  async update(id: number, data: Prisma.ProveedorUncheckedUpdateInput) {
    return this.prisma.proveedor.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.proveedor.delete({ where: { id } });
  }
}
