import { api } from "@/lib/api";

export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProductoDto = Omit<Producto, "id" | "createdAt" | "updatedAt">;
export type UpdateProductoDto = Partial<CreateProductoDto>;

export const productosService = {
  findAll: () => api.get<Producto[]>("/producto"),
  findOne: (id: number) => api.get<Producto>(`/producto/${id}`),
  create: (data: CreateProductoDto) =>
    api.post<Producto>("/producto", data),
  update: (id: number, data: UpdateProductoDto) =>
    api.patch<Producto>(`/producto/${id}`, data),
  remove: (id: number) => api.delete<void>(`/producto/${id}`),
};
