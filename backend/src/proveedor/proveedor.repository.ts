import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class ProveedorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.proveedor.findMany({
        skip,
        take,
        orderBy: { id: 'desc' },
      }),
      this.prisma.proveedor.count(),
    ]);
    return { data, total };
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

  async asociarProductos(proveedorId: number, productosIds: number[]) {
    // Para simplificar y mantener consistencia, evitamos duplicados o los generamos todos dentro de una transacción.
    // Usaremos un proceso transaccional que borre las asocaciones previas si no están en la lista
    // y cree/actualice las que sí.
    const currentAssociations = await this.prisma.proveedorProducto.findMany({
      where: { proveedorId }
    });

    const currentIds = currentAssociations.map(a => a.productoId);
    
    // Identificar los que hay que eliminar
    const toDelete = currentIds.filter(id => !productosIds.includes(id));
    
    // Identificar los que hay que crear (no existían)
    const toCreate = productosIds.filter(id => !currentIds.includes(id));

    return this.prisma.$transaction(async (tx) => {
      // 1. Eliminar los deseleccionados
      if (toDelete.length > 0) {
        await tx.proveedorProducto.deleteMany({
          where: {
            proveedorId,
            productoId: { in: toDelete }
          }
        });
      }
      
      // 2. Crear los nuevos
      if (toCreate.length > 0) {
        await tx.proveedorProducto.createMany({
          data: toCreate.map(id => ({
            proveedorId,
            productoId: id
          }))
        });
      }

      return true;
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
