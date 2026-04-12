import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
