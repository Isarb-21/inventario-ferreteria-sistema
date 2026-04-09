import { Module } from '@nestjs/common';
import { DetalleVentaController } from './detalle-venta.controller';
import { DetalleVentaService } from './detalle-venta.service';

@Module({
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService]
})
export class DetalleVentaModule {}
