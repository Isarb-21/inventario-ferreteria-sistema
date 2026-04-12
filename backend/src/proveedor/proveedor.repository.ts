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
