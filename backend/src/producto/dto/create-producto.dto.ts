import { IsString, IsNumber, IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsNumber()
  @Min(0)
  precioCompra: number;

  @IsNumber()
  @Min(0)
  precioVenta: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stockMinimo?: number;

  @IsInt()
  @IsNotEmpty()
  categoriaId: number;
}
