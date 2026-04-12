import { api } from "@/lib/api";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCategoriaDto = Omit<Categoria, "id" | "createdAt" | "updatedAt">;
export type UpdateCategoriaDto = Partial<CreateCategoriaDto>;

export const categoriasService = {
  findAll: () => api.get<Categoria[]>("/categoria"),
  findOne: (id: number) => api.get<Categoria>(`/categoria/${id}`),
  create: (data: CreateCategoriaDto) => api.post<Categoria>("/categoria", data),
  update: (id: number, data: UpdateCategoriaDto) =>
    api.put<Categoria>(`/categoria/${id}`, data),
  remove: (id: number) => api.delete<void>(`/categoria/${id}`),
};
