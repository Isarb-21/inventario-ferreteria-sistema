// ============================================================
// ProveedorProductoController — Endpoints REST de asociaciones
// HU-04: Asociación Proveedor ↔ Producto (N:M)
//
// GET    /proveedor-producto                          → Todas las asociaciones
// GET    /proveedor-producto/:proveedorId/:productoId → Una asociación
// GET    /proveedor-producto/proveedor/:id            → Por proveedor
// GET    /proveedor-producto/producto/:id             → Por producto
// POST   /proveedor-producto                          → Crear asociación
// PATCH  /proveedor-producto/:proveedorId/:productoId → Actualizar campos
// DELETE /proveedor-producto/:proveedorId/:productoId → Eliminar asociación
// ============================================================

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProveedorProductoService } from './proveedor-producto.service';
import { CreateProveedorProductoDto } from './dto/create-proveedor-producto.dto';
import { UpdateProveedorProductoDto } from './dto/update-proveedor-producto.dto';

@Controller('proveedor-producto')
export class ProveedorProductoController {
  constructor(
    private readonly proveedorProductoService: ProveedorProductoService,
  ) {}

  // ----------------------------------------------------------
  // GET /api/v1/proveedor-producto
  // Lista todas las asociaciones activas
  // ----------------------------------------------------------
  @Get()
  findAll() {
    return this.proveedorProductoService.findAll();
  }

  // ----------------------------------------------------------
  // GET /api/v1/proveedor-producto/proveedor/:id
  // Filtra asociaciones por proveedor
  // IMPORTANTE: rutas específicas ANTES que /:proveedorId/:productoId
  // ----------------------------------------------------------
  @Get('proveedor/:id')
  findByProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorProductoService.findByProveedor(id);
  }

  // ----------------------------------------------------------
  // GET /api/v1/proveedor-producto/producto/:id
  // Filtra asociaciones por producto
  // ----------------------------------------------------------
  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorProductoService.findByProducto(id);
  }

  // ----------------------------------------------------------
  // GET /api/v1/proveedor-producto/:proveedorId/:productoId
  // Obtiene una asociación específica por clave compuesta
  // ----------------------------------------------------------
  @Get(':proveedorId/:productoId')
  findOne(
    @Param('proveedorId', ParseIntPipe) proveedorId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.proveedorProductoService.findOne(proveedorId, productoId);
  }

  // ----------------------------------------------------------
  // POST /api/v1/proveedor-producto
  // Crea una nueva asociación Proveedor-Producto
  // ----------------------------------------------------------
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProveedorProductoDto) {
    return this.proveedorProductoService.create(createDto);
  }

  // ----------------------------------------------------------
  // PATCH /api/v1/proveedor-producto/:proveedorId/:productoId
  // Actualiza campos opcionales de la asociación
  // ----------------------------------------------------------
  @Patch(':proveedorId/:productoId')
  update(
    @Param('proveedorId', ParseIntPipe) proveedorId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
    @Body() updateDto: UpdateProveedorProductoDto,
  ) {
    return this.proveedorProductoService.update(proveedorId, productoId, updateDto);
  }

  // ----------------------------------------------------------
  // DELETE /api/v1/proveedor-producto/:proveedorId/:productoId
  // Elimina la asociación entre proveedor y producto
  // ----------------------------------------------------------
  @Delete(':proveedorId/:productoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('proveedorId', ParseIntPipe) proveedorId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.proveedorProductoService.remove(proveedorId, productoId);
  }
}
