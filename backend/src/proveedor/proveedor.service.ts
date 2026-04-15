import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ProveedorRepository } from './proveedor.repository';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(private readonly proveedorRepo: ProveedorRepository) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.proveedorRepo.findAll(skip, limit);
  }

  async findOne(id: number) {
    const proveedor = await this.proveedorRepo.findWithProductos(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return proveedor;
  }

  async findProductos(id: number) {
    await this.findOne(id); // Verifica que el proveedor exista
    return this.proveedorRepo.findProductos(id);
  }

  async asociarProducto(proveedorId: number, productoId: number) {
    await this.findOne(proveedorId); // Verifica existencia del proveedor
    return this.proveedorRepo.asociarProducto(proveedorId, productoId);
  }

  async asociarProductos(proveedorId: number, productosIds: number[]) {
    await this.findOne(proveedorId); // Validar que existe el proveedor.
    // Opcional: Validar que todos los productos existen
    await this.proveedorRepo.asociarProductos(proveedorId, productosIds);
    return { success: true, message: 'Productos asociados correctamente' };
  }

  async desasociarProducto(proveedorId: number, productoId: number) {
    await this.findOne(proveedorId);
    return this.proveedorRepo.desasociarProducto(proveedorId, productoId);
  }

  async create(data: CreateProveedorDto) {
    // NIT debe ser único en el sistema
    const existeNit = await this.proveedorRepo.findByNit(data.nit.trim());
    if (existeNit) {
      throw new ConflictException('Ya existe un proveedor con ese NIT');
    }

    return this.proveedorRepo.create({
      ...data,
      nombre: data.nombre.trim(),
      nit: data.nit.trim(),
    });
  }

  async update(id: number, data: UpdateProveedorDto) {
    const prov = await this.findOne(id);

    if (data.nit) {
      data.nit = data.nit.trim();
      if (data.nit !== prov.nit) {
        const existeNit = await this.proveedorRepo.findByNit(data.nit);
        if (existeNit) {
          throw new ConflictException('Ya existe un proveedor con ese NIT');
        }
      }
    }

    if (data.nombre) data.nombre = data.nombre.trim();

    return this.proveedorRepo.update(id, data);
  }

  async remove(id: number) {
    const prov = await this.proveedorRepo.findOne(id);
    if (!prov) throw new NotFoundException('Proveedor no encontrado');

    // Verificar si tiene compras asociadas
    if (prov.compras && prov.compras.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el proveedor "${prov.nombre}" porque tiene compras asociadas en el sistema.`
      );
    }

    return this.proveedorRepo.delete(id);
  }
}
