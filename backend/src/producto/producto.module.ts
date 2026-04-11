import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { ProductoRepository } from './producto.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductoController],
  providers: [ProductoService, ProductoRepository]
})
export class ProductoModule {}
