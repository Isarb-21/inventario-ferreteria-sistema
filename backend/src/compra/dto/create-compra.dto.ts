// ============================================================
// DTOs — Módulo de Compras
// HU-05: Registro de Compra a Proveedor
// ============================================================

import {
  IsInt,
  IsPositive,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

// ------------------------------------------------------------
// DetalleCompraDto — Un ítem dentro de la compra
// ------------------------------------------------------------
export class DetalleCompraDto {
  @IsInt({ message: 'El productoId debe ser un número entero' })
  @IsPositive({ message: 'El productoId debe ser un número positivo' })
  productoId: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1 unidad' })
  cantidad: number;

  @IsNumber(
    { maxDecimalPlaces: 4 },
    { message: 'El precio unitario debe ser un número válido (máx. 4 decimales)' },
  )
  @IsPositive({ message: 'El precio unitario debe ser mayor que 0' })
  precioUnitario: number;
}

// ------------------------------------------------------------
// CreateCompraDto — Cuerpo completo del POST /compra
// ------------------------------------------------------------
export class CreateCompraDto {
  @IsInt({ message: 'El proveedorId debe ser un número entero' })
  @IsPositive({ message: 'El proveedorId debe ser un número positivo' })
  proveedorId: number;

  // Fecha opcional: si no se envía, se usa la fecha actual (definida en el schema)
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser una cadena ISO válida (ej: 2024-01-15T10:00:00Z)' })
  fecha?: string;

  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'La compra debe tener al menos un producto en el detalle' })
  @ValidateNested({ each: true, message: 'Cada detalle debe ser un objeto válido' })
  @Type(() => DetalleCompraDto)
  detalles: DetalleCompraDto[];
}
