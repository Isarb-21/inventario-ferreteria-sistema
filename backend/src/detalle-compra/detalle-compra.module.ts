import { Module } from '@nestjs/common';
import { DetalleCompraController } from './detalle-compra.controller';
import { DetalleCompraService } from './detalle-compra.service';

@Module({
  controllers: [DetalleCompraController],
  providers: [DetalleCompraService]
})
export class DetalleCompraModule {}
