// ============================================================
// UpdateProveedorProductoDto
// Solo se pueden actualizar campos opcionales de la relación
// ============================================================

import { IsOptional, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class UpdateProveedorProductoDto {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 4 },
    { message: 'El precio del proveedor debe ser un número válido' },
  )
  @IsPositive({ message: 'El precio del proveedor debe ser mayor que 0' })
  precioProveedor?: number;

  @IsOptional()
  @IsInt({ message: 'El tiempo de entrega debe ser un número entero de días' })
  @Min(0, { message: 'El tiempo de entrega no puede ser negativo' })
  tiempoEntregaDias?: number;
}
