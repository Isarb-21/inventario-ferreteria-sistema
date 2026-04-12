import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaRepository } from './categoria.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaRepository],
  exports: [CategoriaService],
})
export class CategoriaModule {}
