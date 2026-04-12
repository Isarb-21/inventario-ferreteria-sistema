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
  findAll: () => api.get<Proveedor[]>("/proveedor"),
  findOne: (id: number) => api.get<Proveedor>(`/proveedor/${id}`),
  create: (data: CreateProveedorDto) =>
    api.post<Proveedor>("/proveedor", data),
  update: (id: number, data: UpdateProveedorDto) =>
    api.put<Proveedor>(`/proveedor/${id}`, data),
  remove: (id: number) => api.delete<void>(`/proveedor/${id}`),
};
