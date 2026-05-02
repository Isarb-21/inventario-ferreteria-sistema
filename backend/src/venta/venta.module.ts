// ============================================================
// VentaModule — Módulo de Ventas
// ============================================================

import { Module } from '@nestjs/common';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { VentaRepository } from './venta.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VentaController],
  providers: [VentaService, VentaRepository],
  exports: [VentaService],
})
export class VentaModule {}
