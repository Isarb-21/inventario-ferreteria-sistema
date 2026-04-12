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
    if (existe) throw new ConflictException('Esta categoría ya existe.');

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
    if (dto.nombre) dto.nombre = dto.nombre.trim();
    return this.categoriaRepository.update(id, dto);
  }

  async remove(id: number) {
    // 1. Buscamos primero para ver si existe y cargar sus productos
    const cat = await this.findOne(id);

    // 2. Verificamos stock (Regla de Usuario)
    const productosConStock = cat.productos?.filter(p => p.stock > 0) || [];
    if (productosConStock.length > 0) {
      throw new BadRequestException('No se puede eliminar la categoría porque tiene productos con stock.');
    }

    // 3. Eliminamos productos asociados (aunque tengan stock 0)
    await this.categoriaRepository.deleteAssociatedProducts(id);

    // 4. Eliminamos la categoría
    await this.categoriaRepository.delete(id);

    return { message: 'Categoría eliminada con éxito' };
  }
}
