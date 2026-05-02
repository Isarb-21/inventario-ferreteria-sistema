// ============================================================
// services/ventas.service.ts
// HU-07 & HU-08: Ventas — cliente API centralizado
// ============================================================

import { api } from "@/lib/api";

// ---- Tipos internos ------------------------------------------------

/** Línea de detalle tal como la devuelve el backend dentro de /venta */
interface DetalleVentaConProducto {
  id: number;
  ventaId: number;
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

// ---- Tipos públicos de Venta ----------------------------------------

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  detalles: DetalleVentaConProducto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedVentas {
  data: Venta[];
  total: number;
}

// ---- DTOs de creación (espejo del backend) --------------------------

/** DTO para cada línea del detalle al crear una venta */
export interface VentaDetalleInput {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateVentaDto {
  detalles: VentaDetalleInput[];
  // Nota: el "total" NO se envía al backend, se calcula en el servidor
  // Nota: las ventas no tienen proveedorId ni fecha opcional
}

// ---- Parámetros de consulta -----------------------------------------

export interface VentaQueryParams {
  page?: number;
  limit?: number;
}

// ---- Servicio -------------------------------------------------------

export const ventasService = {
  /**
   * HU-08: Listar ventas con paginación.
   */
  findAll: (params?: VentaQueryParams) => {
    const p = params ?? {};
    const query = new URLSearchParams();
    query.set("page", String(p.page ?? 1));
    query.set("limit", String(p.limit ?? 10));
    return api.get<PaginatedVentas>(`/venta?${query.toString()}`);
  },

  /**
   * HU-08: Obtener detalle completo de una venta por ID.
   */
  findOne: (id: number) => api.get<Venta>(`/venta/${id}`),

  /**
   * HU-07: Registrar una nueva venta al público.
   */
  create: (data: CreateVentaDto) => api.post<Venta>("/venta", data),

  // Las ventas son inmutables: no hay update ni delete
};
