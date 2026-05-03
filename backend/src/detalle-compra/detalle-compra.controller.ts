// ============================================================
// DetalleCompraController — Endpoints de consulta (solo lectura)
// Los detalles de compra son INMUTABLES: se crean con la compra
// y no pueden modificarse ni eliminarse (trazabilidad del inventario).
//
// GET /detalle-compra               → Todos los detalles
// GET /detalle-compra/compra/:id    → Detalles de una compra
// GET /detalle-compra/:id           → Un detalle específico
// ============================================================

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleCompraService } from './detalle-compra.service';

@Controller('detalle-compra')
export class DetalleCompraController {
  constructor(private readonly detalleCompraService: DetalleCompraService) {}

  // ----------------------------------------------------------
  // GET /api/v1/detalle-compra
  // Lista todos los detalles de todas las compras
  // ----------------------------------------------------------
  @Get()
  findAll() {
    return this.detalleCompraService.findAll();
  }

  // ----------------------------------------------------------
  // GET /api/v1/detalle-compra/compra/:compraId
  // Lista los detalles de una compra específica
  // IMPORTANTE: Debe ir antes de /:id para evitar captura de rutas
  // ----------------------------------------------------------
  @Get('compra/:compraId')
  findByCompra(@Param('compraId', ParseIntPipe) compraId: number) {
    return this.detalleCompraService.findByCompra(compraId);
  }

  // ----------------------------------------------------------
  // GET /api/v1/detalle-compra/:id
  // Obtiene un detalle específico por su ID
  // ----------------------------------------------------------
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleCompraService.findOne(id);
  }

  // Nota: No hay POST, PUT ni DELETE.
  // Los detalles son generados automáticamente al crear una compra
  // y son inmutables para garantizar la trazabilidad del inventario.
}
