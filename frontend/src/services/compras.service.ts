// ============================================================
// services/compras.service.ts
// HU-05 & HU-06: Compras — cliente API centralizado
// ============================================================

import { api } from "@/lib/api";

// ---- Tipos internos (no re-exportados vía barrel para evitar conflicto) ----

/** Línea de detalle tal como la devuelve el backend dentro de /compra */
interface DetalleCompraConProducto {
  id: number;
  compraId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto?: {
    id: number;
    nombre: string;
    codigo: string;
    precioVenta?: number;
    stock?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ---- Tipos públicos de Compra ----------------------------------------

export interface Compra {
  id: number;
  proveedorId: number;
  fecha: string;
  total: number;
  proveedor?: {
    id: number;
    nombre: string;
    nit: string;
    telefono?: string | null;
    correo?: string | null;
  };
  detalles: DetalleCompraConProducto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCompras {
  data: Compra[];
  total: number;
}

// ---- DTOs de creación (espejo del backend) --------------------------

/** DTO para cada línea del detalle al crear una compra */
export interface CompraDetalleInput {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateCompraDto {
  proveedorId: number;
  fecha?: string; // ISO string opcional
  detalles: CompraDetalleInput[];
  // Nota: el "total" NO se envía al backend, se calcula en el servidor
}

// ---- Parámetros de consulta -----------------------------------------

export interface CompraQueryParams {
  page?: number;
  limit?: number;
  proveedorId?: number;
}

// ---- Servicio -------------------------------------------------------

export const comprasService = {
  /**
   * HU-05 & HU-06: Listar compras con paginación y filtro opcional por proveedor.
   */
  findAll: (params?: CompraQueryParams) => {
    const p = params ?? {};
    const query = new URLSearchParams();
    query.set("page", String(p.page ?? 1));
    query.set("limit", String(p.limit ?? 10));
    if (p.proveedorId !== undefined && p.proveedorId !== null) {
      query.set("proveedorId", String(p.proveedorId));
    }
    return api.get<PaginatedCompras>(`/compra?${query.toString()}`);
  },

  /**
   * HU-05: Obtener detalle completo de una compra por ID.
   */
  findOne: (id: number) => api.get<Compra>(`/compra/${id}`),

  /**
   * HU-05: Registrar una nueva compra a proveedor.
   */
  create: (data: CreateCompraDto) => api.post<Compra>("/compra", data),

  // Las compras son inmutables: no hay update ni delete
};
