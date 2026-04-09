import { Module } from '@nestjs/common';
import { ProveedorProductoController } from './proveedor-producto.controller';
import { ProveedorProductoService } from './proveedor-producto.service';

@Module({
  controllers: [ProveedorProductoController],
  providers: [ProveedorProductoService]
})
export class ProveedorProductoModule {}
