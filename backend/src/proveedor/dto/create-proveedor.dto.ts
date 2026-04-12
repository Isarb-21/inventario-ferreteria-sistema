import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proveedor es requerido' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El NIT es requerido' })
  nit: string;

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
