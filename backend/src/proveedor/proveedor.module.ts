import { Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';
import { ProveedorRepository } from './proveedor.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProveedorController],
  providers: [ProveedorService, ProveedorRepository],
  exports: [ProveedorService],
})
export class ProveedorModule {}
