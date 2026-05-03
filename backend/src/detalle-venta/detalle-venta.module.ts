// ============================================================
// DetalleVentaModule
// ============================================================

import { Module } from '@nestjs/common';
import { DetalleVentaController } from './detalle-venta.controller';
import { DetalleVentaService } from './detalle-venta.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
