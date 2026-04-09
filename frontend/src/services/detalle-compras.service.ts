import { api } from "@/lib/api";

export interface DetalleCompra {
  id?: number;
  compraId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDetalleCompraDto = Omit<DetalleCompra, "id" | "createdAt" | "updatedAt">;
export type UpdateDetalleCompraDto = Partial<CreateDetalleCompraDto>;

export const detalleComprasService = {
  findAll: () => api.get<DetalleCompra[]>("/detalle-compra"),
  findOne: (id: number) => api.get<DetalleCompra>(`/detalle-compra/${id}`),
  create: (data: CreateDetalleCompraDto) =>
    api.post<DetalleCompra>("/detalle-compra", data),
  update: (id: number, data: UpdateDetalleCompraDto) =>
    api.patch<DetalleCompra>(`/detalle-compra/${id}`, data),
  remove: (id: number) => api.delete<void>(`/detalle-compra/${id}`),
};
