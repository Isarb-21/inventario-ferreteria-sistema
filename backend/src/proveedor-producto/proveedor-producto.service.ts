// ============================================================
// ProveedorProductoService — Lógica de negocio de asociaciones
// HU-04: Asociación Proveedor ↔ Producto (N:M)
// ============================================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProveedorProductoDto } from './dto/create-proveedor-producto.dto';
import { UpdateProveedorProductoDto } from './dto/update-proveedor-producto.dto';

@Injectable()
export class ProveedorProductoService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------
  // Listar todas las asociaciones con relaciones incluidas
  // ----------------------------------------------------------
  async findAll() {
    return this.prisma.proveedorProducto.findMany({
      include: {
        proveedor: true,
        producto: { include: { categoria: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------------------------------------------------
  // Obtener una asociación específica por clave compuesta
  // ----------------------------------------------------------
  async findOne(proveedorId: number, productoId: number) {
    const asociacion = await this.prisma.proveedorProducto.findUnique({
      where: { proveedorId_productoId: { proveedorId, productoId } },
      include: {
        proveedor: true,
        producto: { include: { categoria: true } },
      },
    });
    if (!asociacion) {
      throw new NotFoundException(
        `No existe asociación entre proveedor ${proveedorId} y producto ${productoId}`,
      );
    }
    return asociacion;
  }

  // ----------------------------------------------------------
  // Crear una nueva asociación Proveedor-Producto
  // ----------------------------------------------------------
  async create(dto: CreateProveedorProductoDto) {
    // Validar que el proveedor existe
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: dto.proveedorId },
    });
    if (!proveedor) {
      throw new NotFoundException(
        `El proveedor con ID ${dto.proveedorId} no existe`,
      );
    }

    // Validar que el producto existe
    const producto = await this.prisma.producto.findUnique({
      where: { id: dto.productoId },
    });
    if (!producto) {
      throw new NotFoundException(
        `El producto con ID ${dto.productoId} no existe`,
      );
    }

    // Verificar si ya existe la asociación
    const existe = await this.prisma.proveedorProducto.findUnique({
      where: {
        proveedorId_productoId: {
          proveedorId: dto.proveedorId,
          productoId: dto.productoId,
        },
      },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe una asociación entre el proveedor "${proveedor.nombre}" y el producto "${producto.nombre}"`,
      );
    }

    return this.prisma.proveedorProducto.create({
      data: {
        proveedorId: dto.proveedorId,
        productoId: dto.productoId,
        precioProveedor: dto.precioProveedor,
        tiempoEntregaDias: dto.tiempoEntregaDias,
      },
      include: {
        proveedor: true,
        producto: { include: { categoria: true } },
      },
    });
  }

  // ----------------------------------------------------------
  // Actualizar campos opcionales de la asociación
  // (precioProveedor, tiempoEntregaDias)
  // ----------------------------------------------------------
  async update(
    proveedorId: number,
    productoId: number,
    dto: UpdateProveedorProductoDto,
  ) {
    await this.findOne(proveedorId, productoId); // Verifica existencia

    return this.prisma.proveedorProducto.update({
      where: { proveedorId_productoId: { proveedorId, productoId } },
      data: dto,
      include: {
        proveedor: true,
        producto: { include: { categoria: true } },
      },
    });
  }

  // ----------------------------------------------------------
  // Eliminar asociación entre proveedor y producto
  // ----------------------------------------------------------
  async remove(proveedorId: number, productoId: number) {
    await this.findOne(proveedorId, productoId); // Verifica existencia

    return this.prisma.proveedorProducto.delete({
      where: { proveedorId_productoId: { proveedorId, productoId } },
    });
  }

  // ----------------------------------------------------------
  // Listar todas las asociaciones de un proveedor específico
  // ----------------------------------------------------------
  async findByProveedor(proveedorId: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });
    if (!proveedor) {
      throw new NotFoundException(
        `El proveedor con ID ${proveedorId} no existe`,
      );
    }

    return this.prisma.proveedorProducto.findMany({
      where: { proveedorId },
      include: {
        producto: { include: { categoria: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------------------------------------------------
  // Listar todos los proveedores de un producto específico
  // ----------------------------------------------------------
  async findByProducto(productoId: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });
    if (!producto) {
      throw new NotFoundException(
        `El producto con ID ${productoId} no existe`,
      );
    }

    return this.prisma.proveedorProducto.findMany({
      where: { productoId },
      include: {
        proveedor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
