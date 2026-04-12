import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true, // Includes products to check relationships
      },
    });
  }

  async findByNombre(nombre: string) {
    return this.prisma.categoria.findUnique({
      where: { nombre },
    });
  }

  async create(data: Prisma.CategoriaUncheckedCreateInput) {
    return this.prisma.categoria.create({ data });
  }

  async update(id: number, data: Prisma.CategoriaUncheckedUpdateInput) {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async deleteAssociatedProducts(categoriaId: number) {
    return this.prisma.producto.deleteMany({
      where: { categoriaId },
    });
  }

  async delete(id: number) {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
