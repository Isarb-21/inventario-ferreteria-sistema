import { api } from "@/lib/api";

export interface ProveedorProducto {
  proveedorId: number;
  productoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProveedorProductoId = { proveedorId: number; productoId: number };
export type CreateProveedorProductoDto = Omit<ProveedorProducto, "createdAt" | "updatedAt">;

export const proveedorProductosService = {
  findAll: () => api.get<ProveedorProducto[]>("/proveedor-producto"),
  findOne: ({ proveedorId, productoId }: ProveedorProductoId) =>
    api.get<ProveedorProducto>(`/proveedor-producto/${proveedorId}/${productoId}`),
  create: (data: CreateProveedorProductoDto) =>
    api.post<ProveedorProducto>("/proveedor-producto", data),
  remove: ({ proveedorId, productoId }: ProveedorProductoId) =>
    api.delete<void>(`/proveedor-producto/${proveedorId}/${productoId}`),
};
