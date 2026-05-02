// ============================================================
// VentaController — Endpoints REST de Ventas
// HU-07: POST /venta, GET /venta, GET /venta/:id
// HU-08: GET /venta (listado paginado), GET /venta/:id (detalle)
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
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  // ----------------------------------------------------------
  // POST /api/v1/venta
  // HU-07: Registrar una nueva venta al público
  // ----------------------------------------------------------
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVentaDto: CreateVentaDto) {
    // Sin lógica de negocio aquí: el service lo maneja todo
    return this.ventaService.create(createVentaDto);
  }

  // ----------------------------------------------------------
  // GET /api/v1/venta?page=1&limit=10
  // HU-08: Historial de ventas con paginación
  // ----------------------------------------------------------
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ventaService.findAll(page, limit);
  }

  // ----------------------------------------------------------
  // GET /api/v1/venta/:id
  // HU-08: Ver detalle completo de una venta específica
  // ----------------------------------------------------------
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.findOne(id);
  }

  // Nota: No hay PUT ni DELETE.
  // Las ventas son inmutables por diseño (auditoría de inventario).
}
