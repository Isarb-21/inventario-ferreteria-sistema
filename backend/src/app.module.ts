import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ProveedorProductoModule } from './proveedor-producto/proveedor-producto.module';
import { CompraModule } from './compra/compra.module';
import { DetalleCompraModule } from './detalle-compra/detalle-compra.module';
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Lee .env automáticamente
    PrismaModule, CategoriaModule, ProductoModule, ProveedorModule, ProveedorProductoModule, CompraModule, DetalleCompraModule, VentaModule, DetalleVentaModule,                             // Conexión a la BD
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}