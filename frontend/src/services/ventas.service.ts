import { api } from "@/lib/api";
import { DetalleVenta } from "./detalle-ventas.service";

export interface CreateVentaDetalleDto {
  id?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  detalles: DetalleVenta[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVentaDto {
  total: number;
  detalles: CreateVentaDetalleDto[];
}

export const ventasService = {
  findAll: () => api.get<Venta[]>("/venta"),
  findOne: (id: number) => api.get<Venta>(`/venta/${id}`),
  create: (data: CreateVentaDto) =>
    api.post<Venta>("/venta", data),
  remove: (id: number) => api.delete<void>(`/venta/${id}`),
};
