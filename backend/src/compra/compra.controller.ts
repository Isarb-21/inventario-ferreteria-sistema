// ============================================================
// CompraController — Endpoints REST de Compras
// HU-05: POST /compra, GET /compra, GET /compra/:id
// HU-06: GET /compra?proveedorId=X (filtro incluido en findAll)
// ============================================================

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
} from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  // ----------------------------------------------------------
  // POST /api/v1/compra
  // HU-05: Registrar una nueva compra a proveedor
  // ----------------------------------------------------------
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCompraDto: CreateCompraDto) {
    // Sin lógica de negocio aquí: el service lo maneja todo
    return this.compraService.create(createCompraDto);
  }

  // ----------------------------------------------------------
  // GET /api/v1/compra?page=1&limit=10&proveedorId=3
  // HU-05: Historial de compras con paginación
  // HU-06: Filtro por proveedor mediante ?proveedorId
  // ----------------------------------------------------------
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('proveedorId') proveedorId?: string,
  ) {
    // proveedorId es opcional: lo convertimos a número solo si viene
    const parsedProveedorId = proveedorId ? parseInt(proveedorId, 10) : undefined;
    return this.compraService.findAll(page, limit, parsedProveedorId);
  }

  // ----------------------------------------------------------
  // GET /api/v1/compra/:id
  // HU-05: Ver detalle completo de una compra específica
  // ----------------------------------------------------------
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.compraService.findOne(id);
  }

  // Nota: No hay PUT ni DELETE.
  // Las compras son inmutables por diseño (auditoría de inventario).
}
