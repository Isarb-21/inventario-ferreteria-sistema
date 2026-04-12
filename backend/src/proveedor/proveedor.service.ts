import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ProveedorRepository } from './proveedor.repository';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(private readonly proveedorRepo: ProveedorRepository) {}

  async findAll() {
    return this.proveedorRepo.findAll();
  }

  async findOne(id: number) {
    const proveedor = await this.proveedorRepo.findOne(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return proveedor;
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
