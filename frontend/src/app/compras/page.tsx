// ============================================================
// app/compras/page.tsx — Listado de compras
// HU-05: Historial paginado | HU-06: Filtro por proveedor
// ============================================================
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  comprasService,
  Compra,
} from "@/services/compras.service";
import FiltroProveedor from "@/components/FiltroProveedor/FiltroProveedor";
import styles from "./compra.module.css";

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filtro HU-06
  const [proveedorId, setProveedorId] = useState<number | undefined>(undefined);

  // Cuando cambia proveedor, volver a página 1
  const handleProveedorChange = (id: number | undefined) => {
    setProveedorId(id);
    setPage(1);
  };

  const fetchCompras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await comprasService.findAll({ page, limit, proveedorId });
      // El interceptor del backend envuelve en { data, total }
      if (res && typeof res === "object" && "data" in res) {
        setCompras(res.data);
        setTotal(res.total);
      } else {
        setCompras([]);
        setTotal(0);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar las compras";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, proveedorId]);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const totalPages = Math.ceil(total / limit) || 1;

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatMonto = (n: number) =>
    new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className={styles.container}>
      {/* ── Encabezado ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Compras</h1>
        <Link href="/compras/new" className={styles.btnPrimary} id="btn-nueva-compra">
          + Nueva Compra
        </Link>
      </div>

      <div className={styles.card}>
        {/* ── Toolbar: filtro HU-06 ── */}
        <div className={styles.toolbar}>
          <FiltroProveedor
            value={proveedorId}
            onChange={handleProveedorChange}
            placeholder="Todos los proveedores"
          />
          {proveedorId !== undefined && (
            <button
              className={styles.btnGhost}
              onClick={() => handleProveedorChange(undefined)}
              id="btn-limpiar-filtro"
            >
              ✕ Limpiar filtro
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className={styles.alertError} role="alert">
            {error}
          </div>
        )}

        {/* ── Tabla ── */}
        {loading ? (
          <div className={styles.loading}>Cargando compras…</div>
        ) : compras.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <p className={styles.emptyText}>
              {proveedorId !== undefined
                ? "No se encontraron compras para este proveedor."
                : "No hay compras registradas aún."}
            </p>
          </div>
        ) : (
          <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={styles.badge}>#{c.id}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatFecha(c.fecha)}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {c.proveedor?.nombre ?? `Proveedor #${c.proveedorId}`}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        {c.detalles?.length ?? 0} ítem{c.detalles?.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatMonto(c.total)}</td>
                    <td>
                      <Link
                        href={`/compras/${c.id}`}
                        className={styles.btnAction}
                        id={`btn-ver-compra-${c.id}`}
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Paginación ── */}
        {!loading && total > 0 && (
          <div className={styles.pagination}>
            <button
              className={styles.btnSecondary}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              id="btn-pagina-anterior"
            >
              ← Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {page} de {totalPages}
              <span style={{ marginLeft: "0.5rem", color: "#9ca3af", fontWeight: 400 }}>
                ({total} compras)
              </span>
            </span>
            <button
              className={styles.btnSecondary}
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              id="btn-pagina-siguiente"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
