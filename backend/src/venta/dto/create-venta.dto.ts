// ============================================================
// DTOs — Módulo de Ventas
// HU-07: Registro de Venta al Público
// ============================================================

import {
  IsInt,
  IsPositive,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ------------------------------------------------------------
// DetalleVentaDto — Un ítem dentro de la venta
// ------------------------------------------------------------
export class DetalleVentaDto {
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
// CreateVentaDto — Cuerpo completo del POST /venta
// Nota: A diferencia de Compra, las ventas no tienen proveedor
// ni fecha opcional (usa @default(now()) del schema).
// ------------------------------------------------------------
export class CreateVentaDto {
  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto en el detalle' })
  @ValidateNested({ each: true, message: 'Cada detalle debe ser un objeto válido' })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}
