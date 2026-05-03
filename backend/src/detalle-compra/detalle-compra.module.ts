// ============================================================
// DetalleCompraModule
// ============================================================

import { Module } from '@nestjs/common';
import { DetalleCompraController } from './detalle-compra.controller';
import { DetalleCompraService } from './detalle-compra.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetalleCompraController],
  providers: [DetalleCompraService],
  exports: [DetalleCompraService],
})
export class DetalleCompraModule {}
