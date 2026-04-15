import { api } from "@/lib/api";

export interface Proveedor {
  id: number;
  nombre: string;
  nit: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProveedorDto = Omit<Proveedor, "id" | "createdAt" | "updatedAt">;
export type UpdateProveedorDto = Partial<CreateProveedorDto>;

export const proveedoresService = {
  findAll: (params?: { page?: number; limit?: number }) => {
    const query = params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : '';
    return api.get<{ data: Proveedor[]; total: number }>(`/proveedor${query}`);
  },
  findOne: (id: number) => api.get<Proveedor>(`/proveedor/${id}`),
  create: (data: CreateProveedorDto) =>
    api.post<Proveedor>("/proveedor", data),
  update: (id: number, data: UpdateProveedorDto) =>
    api.put<Proveedor>(`/proveedor/${id}`, data),
  remove: (id: number) => api.delete<void>(`/proveedor/${id}`),
  findProductos: (id: number) => api.get<any[]>(`/proveedor/${id}/productos`),
  asociarProductos: (id: number, productosIds: number[]) => 
    api.post<any>(`/proveedor/${id}/productos`, { productosIds }),
};
