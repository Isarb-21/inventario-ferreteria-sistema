// ============================================================
// CompraModule — Módulo de Compras
// ============================================================

import { Module } from '@nestjs/common';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { CompraRepository } from './compra.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompraController],
  providers: [CompraService, CompraRepository],
  exports: [CompraService],
})
export class CompraModule {}
