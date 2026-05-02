// ============================================================
// app/ventas/page.tsx — Listado de ventas
// HU-08: Historial paginado de ventas
// ============================================================
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ventasService,
  Venta,
} from "@/services/ventas.service";
import styles from "./venta.module.css";

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ventasService.findAll({ page, limit });
      // El interceptor del backend envuelve en { data, total }
      if (res && typeof res === "object" && "data" in res) {
        setVentas(res.data);
        setTotal(res.total);
      } else {
        setVentas([]);
        setTotal(0);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar las ventas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const totalPages = Math.ceil(total / limit) || 1;

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatMonto = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className={styles.container}>
      {/* ── Encabezado ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Ventas</h1>
        <Link href="/ventas/new" className={styles.btnPrimary} id="btn-nueva-venta">
          + Nueva Venta
        </Link>
      </div>

      <div className={styles.card}>
        {/* ── Error ── */}
        {error && (
          <div className={styles.alertError} role="alert">
            {error}
          </div>
        )}

        {/* ── Tabla ── */}
        {loading ? (
          <div className={styles.loading}>Cargando ventas…</div>
        ) : ventas.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🧾</div>
            <p className={styles.emptyText}>
              No hay ventas registradas aún.
            </p>
          </div>
        ) : (
          <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Ítems</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span className={styles.badge}>#{v.id}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatFecha(v.fecha)}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        {v.detalles?.length ?? 0} ítem{v.detalles?.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatMonto(v.total)}</td>
                    <td>
                      <Link
                        href={`/ventas/${v.id}`}
                        className={styles.btnAction}
                        id={`btn-ver-venta-${v.id}`}
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
                ({total} ventas)
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
