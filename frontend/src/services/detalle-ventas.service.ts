import { api } from "@/lib/api";

export interface DetalleVenta {
  id?: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDetalleVentaDto = Omit<DetalleVenta, "id" | "createdAt" | "updatedAt">;
export type UpdateDetalleVentaDto = Partial<CreateDetalleVentaDto>;

export const detalleVentasService = {
  findAll: () => api.get<DetalleVenta[]>("/detalle-venta"),
  findOne: (id: number) => api.get<DetalleVenta>(`/detalle-venta/${id}`),
  create: (data: CreateDetalleVentaDto) =>
    api.post<DetalleVenta>("/detalle-venta", data),
  update: (id: number, data: UpdateDetalleVentaDto) =>
    api.patch<DetalleVenta>(`/detalle-venta/${id}`, data),
  remove: (id: number) => api.delete<void>(`/detalle-venta/${id}`),
};
