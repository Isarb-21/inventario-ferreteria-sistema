// ============================================================
// DTOs — Módulo DetalleVenta
// Nota: Los detalles se crean internamente en la transacción
// de VentaRepository. Este DTO existe para cumplir el DoD
// (arquitectura en capas con DTOs validados).
// ============================================================

import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsInt({ message: 'El ventaId debe ser un número entero' })
  @IsPositive({ message: 'El ventaId debe ser un número positivo' })
  ventaId: number;

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
