import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class UpdateProveedorDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nit?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}
