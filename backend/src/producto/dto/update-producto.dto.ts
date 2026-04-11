import { IsString, IsNumber, IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  codigo?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioCompra?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stockMinimo?: number;

  @IsInt()
  @IsOptional()
  categoriaId?: number;
}
