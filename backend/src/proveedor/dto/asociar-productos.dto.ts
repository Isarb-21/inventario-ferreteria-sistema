import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class AsociarProductosDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productosIds: number[];
}
