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
  categoria?: { id: number, nombre: string }; // from relation
  createdAt?: string;
  updatedAt?: string;
}

/** Producto con stock bajo — devuelto por GET /producto/stock-bajo */
export interface StockBajoProducto extends Producto {
  categoria: { id: number; nombre: string; descripcion?: string | null };
}

export type CreateProductoDto = Omit<Producto, "id" | "createdAt" | "updatedAt" | "categoria">;
export type UpdateProductoDto = Partial<CreateProductoDto>;

export const productosService = {
  findAll: (params?: { page?: number; limit?: number }) => {
    const query = params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : '';
    return api.get<{ data: Producto[]; total: number }>(`/producto${query}`);
  },
  findOne: (id: number) => api.get<Producto>(`/producto/${id}`),
  create: (data: CreateProductoDto) =>
    api.post<Producto>("/producto", data),
  update: (id: number, data: UpdateProductoDto) =>
    api.put<Producto>(`/producto/${id}`, data),
  remove: (id: number) => api.delete<void>(`/producto/${id}`),
  findProveedores: (id: number) => api.get<any[]>(`/producto/${id}/proveedores`),
  /** HU-09: Productos con stock menor al mínimo configurado */
  findStockBajo: () => api.get<StockBajoProducto[]>("/producto/stock-bajo"),
};

