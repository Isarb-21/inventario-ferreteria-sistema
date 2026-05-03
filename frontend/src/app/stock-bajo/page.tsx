// ============================================================
// app/stock-bajo/page.tsx — Alertas de Stock Bajo Mínimo
// HU-09: Visualizar productos con stock < stockMinimo
// ============================================================
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { productosService, StockBajoProducto } from "@/services/productos.service";
import styles from "./stock-bajo.module.css";

export default function StockBajoPage() {
  const [productos, setProductos] = useState<StockBajoProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStockBajo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productosService.findStockBajo();
      // El interceptor ya extrae data del envelope
      const lista = Array.isArray(data) ? data : [];
      setProductos(lista);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cargar los productos con stock bajo";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockBajo();
  }, [fetchStockBajo]);

  // ── Helpers ───────────────────────────────────────────────
  /**
   * Clasifica el nivel de urgencia:
   * - "critical": stock = 0 o stock <= stockMinimo * 0.3
   * - "low": stock < stockMinimo
   */
  const getUrgency = (p: StockBajoProducto): "critical" | "low" => {
    if (p.stock === 0 || p.stock <= Math.floor(p.stockMinimo * 0.3)) {
      return "critical";
    }
    return "low";
  };

  /** Porcentaje de llenado para la barra de stock */
  const getStockPercent = (p: StockBajoProducto): number => {
    if (p.stockMinimo === 0) return 0;
    return Math.min(100, Math.round((p.stock / p.stockMinimo) * 100));
  };

  const formatHora = (d: Date) =>
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  const criticos = productos.filter((p) => getUrgency(p) === "critical");
  const bajos = productos.filter((p) => getUrgency(p) === "low");

  return (
    <div className={styles.container}>
      {/* ── Encabezado ── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.icon}>⚠️</span>
          <div>
            <h1 className={styles.title}>Stock Bajo Mínimo</h1>
            <p className={styles.subtitle}>
              Productos que requieren reabastecimiento urgente
              {lastUpdated && (
                <> · Actualizado a las {formatHora(lastUpdated)}</>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {!loading && (
            <span
              className={`${styles.badgeCount} ${
                productos.length === 0 ? styles.badgeOk : ""
              }`}
            >
              {productos.length === 0
                ? "✓ Todo en orden"
                : `${productos.length} producto${productos.length !== 1 ? "s" : ""} en alerta`}
            </span>
          )}
          <button
            className={styles.btnRefresh}
            onClick={fetchStockBajo}
            disabled={loading}
            id="btn-refresh-stock"
            aria-label="Actualizar lista"
          >
            {loading ? "⟳" : "↺"} Actualizar
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className={styles.alertError} role="alert">
          {error}
        </div>
      )}

      {/* ── Panel informativo ── */}
      {!loading && !error && (
        <div className={styles.infoPanel}>
          <span className={styles.infoPanelIcon}>💡</span>
          <span>
            Se muestran los productos donde el stock actual es{" "}
            <strong>menor al stock mínimo</strong> configurado.{" "}
            {criticos.length > 0 && (
              <>
                <strong style={{ color: "#f87171" }}>
                  {criticos.length} crítico{criticos.length !== 1 ? "s" : ""}
                </strong>{" "}
                (stock en 0 o ≤30% del mínimo).{" "}
              </>
            )}
            Registra una compra para reponer el inventario.
          </span>
        </div>
      )}

      {/* ── Contenido ── */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Consultando inventario…</span>
          </div>
        ) : productos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✅</div>
            <p className={styles.emptyTitle}>¡Inventario saludable!</p>
            <p className={styles.emptyText}>
              Todos los productos tienen stock igual o superior al mínimo
              configurado. No hay alertas pendientes.
            </p>
          </div>
        ) : (
          <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Categoría</th>
                  <th>Urgencia</th>
                  <th>Stock Actual / Mínimo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {/* Primero los críticos, luego los bajos */}
                {[...criticos, ...bajos].map((p) => {
                  const urgency = getUrgency(p);
                  const pct = getStockPercent(p);
                  return (
                    <tr key={p.id}>
                      {/* Nombre */}
                      <td style={{ fontWeight: 600, color: "#f1f5f9" }}>
                        {p.nombre}
                      </td>

                      {/* Código */}
                      <td>
                        <span className={styles.badge}>{p.codigo}</span>
                      </td>

                      {/* Categoría */}
                      <td>
                        <span className={styles.badgeCategory}>
                          {p.categoria?.nombre ?? "—"}
                        </span>
                      </td>

                      {/* Urgencia */}
                      <td>
                        <span
                          className={`${styles.badge} ${
                            urgency === "critical"
                              ? styles.badgeDanger
                              : styles.badgeWarning
                          }`}
                        >
                          {urgency === "critical" ? "🔴 Crítico" : "🟡 Bajo"}
                        </span>
                      </td>

                      {/* Barra de stock */}
                      <td>
                        <div className={styles.stockBar}>
                          <div className={styles.stockBarTrack}>
                            <div
                              className={`${styles.stockBarFill} ${
                                urgency === "critical"
                                  ? styles.stockBarFillCritical
                                  : styles.stockBarFillLow
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={styles.stockNumbers}>
                            <span
                              className={
                                urgency === "critical"
                                  ? styles.stockCritical
                                  : styles.stockLow
                              }
                            >
                              {p.stock}
                            </span>
                            {" / "}
                            {p.stockMinimo} uds.
                          </span>
                        </div>
                      </td>

                      {/* Acción */}
                      <td>
                        <Link
                          href="/compras/new"
                          className={styles.btnCompra}
                          id={`btn-compra-${p.id}`}
                        >
                          🛒 Reponer
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
