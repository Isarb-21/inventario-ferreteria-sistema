// ============================================================
// DTOs — Módulo ProveedorProducto
// HU-04: Asociación Proveedor ↔ Producto (N:M)
// ============================================================

import {
  IsInt,
  IsPositive,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateProveedorProductoDto {
  @IsInt({ message: 'El proveedorId debe ser un número entero' })
  @IsPositive({ message: 'El proveedorId debe ser un número positivo' })
  proveedorId: number;

  @IsInt({ message: 'El productoId debe ser un número entero' })
  @IsPositive({ message: 'El productoId debe ser un número positivo' })
  productoId: number;

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
