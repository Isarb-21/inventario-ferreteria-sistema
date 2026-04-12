import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriaRepository } from './categoria.repository';

@Injectable()
export class CategoriaService {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async create(dto: CreateCategoriaDto) {
    const nombre = dto.nombre.trim();
    // Verificamos si ya existe con este nombre
    const existe = await this.categoriaRepository.findByNombre(nombre);
    if (existe) throw new ConflictException('Ya existe una categoría con ese nombre.');

    return this.categoriaRepository.create({ ...dto, nombre });
  }

  async findAll() {
    return this.categoriaRepository.findAll();
  }

  async findOne(id: number) {
    const cat = await this.categoriaRepository.findOne(id);
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    return cat;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const cat = await this.findOne(id);

    if (dto.nombre) {
      dto.nombre = dto.nombre.trim();
      // Validar unicidad del nombre si está cambiando
      if (dto.nombre !== cat.nombre) {
        const existe = await this.categoriaRepository.findByNombre(dto.nombre);
        if (existe) throw new ConflictException('Ya existe una categoría con ese nombre.');
      }
    }

    return this.categoriaRepository.update(id, dto);
  }

  async remove(id: number) {
    // 1. Buscamos primero para ver si existe y cargar sus productos
    const cat = await this.findOne(id);

    // 2. Si tiene CUALQUIER producto asociado se rechaza la eliminación (criterio de aceptación)
    if (cat.productos && cat.productos.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría "${cat.nombre}" porque tiene ${cat.productos.length} producto(s) asociado(s). Reasigne o elimine los productos primero.`
      );
    }

    // 3. Eliminamos la categoría (no hay productos que eliminar)
    await this.categoriaRepository.delete(id);

    return { message: 'Categoría eliminada con éxito' };
  }
}
