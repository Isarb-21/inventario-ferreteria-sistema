import { api } from "@/lib/api";
import { DetalleCompra } from "./detalle-compras.service";

export interface CreateCompraDetalleDto {
  id?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Compra {
  id: number;
  proveedorId: number;
  fecha: string;
  total: number;
  detalles: DetalleCompra[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompraDto {
  proveedorId: number;
  total: number;
  detalles: CreateCompraDetalleDto[];
}
// Nota: Normalmente las compras no se actualizan por temas de auditoría inventario
export type UpdateCompraDto = Partial<CreateCompraDto>;

export const comprasService = {
  findAll: () => api.get<Compra[]>("/compra"),
  findOne: (id: number) => api.get<Compra>(`/compra/${id}`),
  create: (data: CreateCompraDto) =>
    api.post<Compra>("/compra", data),
//   update: (id: number, data: UpdateCompraDto) =>
//     api.patch<Compra>(`/compra/${id}`, data),
  remove: (id: number) => api.delete<void>(`/compra/${id}`),
};
