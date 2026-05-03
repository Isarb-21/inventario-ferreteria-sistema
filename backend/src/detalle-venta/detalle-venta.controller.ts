// ============================================================
// DetalleVentaController — Endpoints de consulta (solo lectura)
// Los detalles de venta son INMUTABLES: se crean con la venta
// y no pueden modificarse ni eliminarse (integridad del historial).
//
// GET /detalle-venta               → Todos los detalles
// GET /detalle-venta/venta/:id     → Detalles de una venta
// GET /detalle-venta/:id           → Un detalle específico
// ============================================================

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  // ----------------------------------------------------------
  // GET /api/v1/detalle-venta
  // Lista todos los detalles de todas las ventas
  // ----------------------------------------------------------
  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  // ----------------------------------------------------------
  // GET /api/v1/detalle-venta/venta/:ventaId
  // Lista los detalles de una venta específica
  // IMPORTANTE: Debe ir antes de /:id para evitar captura de rutas
  // ----------------------------------------------------------
  @Get('venta/:ventaId')
  findByVenta(@Param('ventaId', ParseIntPipe) ventaId: number) {
    return this.detalleVentaService.findByVenta(ventaId);
  }

  // ----------------------------------------------------------
  // GET /api/v1/detalle-venta/:id
  // Obtiene un detalle específico por su ID
  // ----------------------------------------------------------
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }

  // Nota: No hay POST, PUT ni DELETE.
  // Los detalles son generados automáticamente al crear una venta
  // y son inmutables para garantizar la trazabilidad del inventario.
}
