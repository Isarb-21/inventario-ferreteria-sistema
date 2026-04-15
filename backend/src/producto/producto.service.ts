import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductoRepository } from './producto.repository';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly productoRepo: ProductoRepository) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.productoRepo.findAll(skip, limit);
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne(id);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async findProveedores(id: number) {
    await this.findOne(id); // Validar existencia
    return this.productoRepo.findProveedores(id);
  }

  async create(data: CreateProductoDto) {
    if (data.precioVenta < data.precioCompra) {
      throw new BadRequestException('El precio de venta debe ser mayor o igual al precio de compra');
    }
    
    // Limpiamos código y nombre de espacios
    const cleanCodigo = data.codigo.trim();
    const cleanNombre = data.nombre.trim();

    const existCod = await this.productoRepo.findByCodigo(cleanCodigo);
    if (existCod) {
      throw new BadRequestException('El código del producto ya existe');
    }

    return this.productoRepo.create({
      ...data,
      nombre: cleanNombre,
      codigo: cleanCodigo,
      stockMinimo: data.stockMinimo || 0,
    });
  }

  async update(id: number, data: UpdateProductoDto) {
    const prod = await this.findOne(id);

    const checkVenta = data.precioVenta ?? prod.precioVenta;
    const checkCompra = data.precioCompra ?? prod.precioCompra;

    if (checkVenta < checkCompra) {
      throw new BadRequestException('El precio de venta debe ser mayor o igual al precio de compra');
    }

    if (data.codigo) {
      data.codigo = data.codigo.trim();
      if (data.codigo !== prod.codigo) {
        const existCod = await this.productoRepo.findByCodigo(data.codigo);
        if (existCod) {
          throw new BadRequestException('El código del producto ya existe');
        }
      }
    }

    if (data.nombre) {
      data.nombre = data.nombre.trim();
    }

    return this.productoRepo.update(id, data);
  }

  async remove(id: number) {
    const prod = await this.productoRepo.findOne(id);
    if (!prod) throw new NotFoundException('Producto no encontrado');

    if ((prod.detallesCompra && prod.detallesCompra.length > 0) || (prod.detallesVenta && prod.detallesVenta.length > 0)) {
      throw new BadRequestException('No se puede eliminar un producto con movimientos (compras o ventas asociadas)');
    }

    return this.productoRepo.delete(id);
  }
}
