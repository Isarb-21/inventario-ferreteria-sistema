import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class ProductoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.producto.findMany({
        skip,
        take,
        include: { categoria: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.producto.count(),
    ]);
    return { data, total };
  }

  async findOne(id: number) {
    // Return with related movements to check for existence before deletion
    return this.prisma.producto.findUnique({
      where: { id },
      include: { 
        categoria: true,
        detallesCompra: { take: 1 },
        detallesVenta: { take: 1 },
      },
    });
  }

  async findByCodigo(codigo: string) {
    return this.prisma.producto.findUnique({ where: { codigo } });
  }

  async create(data: Prisma.ProductoUncheckedCreateInput) {
    return this.prisma.producto.create({ data });
  }

  async update(id: number, data: Prisma.ProductoUncheckedUpdateInput) {
    return this.prisma.producto.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }

  async findProveedores(id: number) {
    return this.prisma.proveedorProducto.findMany({
      where: { productoId: id },
      include: {
        proveedor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------------------------------------------------
  // HU-09: Productos con stock por debajo del mínimo
  // Prisma no soporta comparación campo-campo (stock < stockMinimo)
  // en where, por lo que cargamos candidatos (stock < máximo razonable)
  // y filtramos en JS. Seguro para el dataset académico.
  // ----------------------------------------------------------
  async findStockBajo() {
    // Obtener todos los productos donde stockMinimo > 0
    // (si stockMinimo=0 y stock=0 no es realmente "bajo mínimo")
    const productos = await this.prisma.producto.findMany({
      where: {
        stockMinimo: { gt: 0 },
      },
      include: { categoria: true },
      orderBy: { stock: 'asc' },
    });
    // Filtrar en JS: solo los que tienen stock actual < stockMinimo
    return productos.filter((p) => p.stock < p.stockMinimo);
  }
}

