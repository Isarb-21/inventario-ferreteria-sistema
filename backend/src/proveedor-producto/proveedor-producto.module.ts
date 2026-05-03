// ============================================================
// ProveedorProductoModule
// HU-04: Asociación Proveedor ↔ Producto (N:M)
// ============================================================

import { Module } from '@nestjs/common';
import { ProveedorProductoController } from './proveedor-producto.controller';
import { ProveedorProductoService } from './proveedor-producto.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProveedorProductoController],
  providers: [ProveedorProductoService],
  exports: [ProveedorProductoService],
})
export class ProveedorProductoModule {}
