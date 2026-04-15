import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Get()
  findAll() {
    return this.proveedorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.findOne(id);
  }

  @Post()
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.remove(id);
  }

  @Get(':id/productos')
  findProductos(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.findProductos(id);
  }

  @Post(':id/productos')
  asociarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.proveedorService.asociarProducto(id, productoId);
  }

  @Delete(':id/productos/:productoId')
  desasociarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.proveedorService.desasociarProducto(id, productoId);
  }
}
