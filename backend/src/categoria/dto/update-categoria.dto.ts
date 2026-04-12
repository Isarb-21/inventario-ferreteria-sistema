import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
