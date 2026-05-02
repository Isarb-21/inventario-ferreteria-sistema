// ============================================================
// app/ventas/[id]/page.tsx — Detalle de una venta
// HU-08: Consultar venta por ID con detalle completo
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ventasService, Venta } from "@/services/ventas.service";
import styles from "../venta.module.css";
import { ApiError } from "@/lib/api";

export default function DetalleVentaPage() {
  const params = useParams();
  const id = Number(params.id);

  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("ID de venta inválido");
      setLoading(false);
      return;
    }

    ventasService
      .findOne(id)
      .then((data) => setVenta(data))
      .catch((err: unknown) => {
        let msg = "Error al cargar la venta";
        if (err instanceof ApiError) {
          msg = err.status === 404
            ? `La venta #${id} no existe`
            : err.messages.join(" · ");
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>Cargando detalle de venta…</div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !venta) {
    return (
      <div className={styles.container}>
        <Link href="/ventas" className={styles.backLink}>
          ← Volver a ventas
        </Link>
        <div className={styles.card}>
          <div className={styles.alertError} role="alert">
            {error ?? "No se pudo cargar la venta"}
          </div>
        </div>
      </div>
    );
  }

  // ── Datos calculados ─────────────────────────────────────
  const totalItems = venta.detalles.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <div className={styles.container}>
      {/* ── Navegación ── */}
      <Link href="/ventas" className={styles.backLink}>
        ← Volver al historial de ventas
      </Link>

      {/* ── Encabezado ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Venta #{venta.id}</h1>
        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
          Registrada
        </span>
      </div>

      {/* ── Resumen ── */}
      <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
        <p className={styles.sectionTitle}>Información General</p>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>Fecha de Venta</span>
            <span className={styles.infoItemValue}>
              {formatFecha(venta.fecha)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>N° de Ítems</span>
            <span className={styles.infoItemValue}>
              {venta.detalles.length} producto{venta.detalles.length !== 1 ? "s" : ""} ({totalItems} unidades)
            </span>
          </div>
        </div>

        {/* Total destacado */}
        <div className={styles.totalBox}>
          <span className={styles.totalLabel}>Total de la Venta:</span>
          <span className={styles.totalValue}>{formatMonto(venta.total)}</span>
        </div>
      </div>

      {/* ── Detalle de productos ── */}
      <div className={styles.card}>
        <p className={styles.sectionTitle}>Detalle de Productos</p>
        <div className={styles.tableWrapper}>
          <table className={styles.detailTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d, i) => {
                const subtotal = d.cantidad * d.precioUnitario;
                return (
                  <tr key={d.id}>
                    <td style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                      {i + 1}
                    </td>
                    <td>
                      <span className={styles.badge}>
                        {d.producto?.codigo ?? "—"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {d.producto?.nombre ?? `Producto #${d.productoId}`}
                    </td>
                    <td>
                      <strong>{d.cantidad}</strong> uds.
                    </td>
                    <td>{formatMonto(d.precioUnitario)}</td>
                    <td style={{ fontWeight: 700 }}>{formatMonto(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Nota de inmutabilidad */}
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.82rem",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          🔒 Las ventas son inmutables para garantizar la trazabilidad del
          inventario. No es posible editarlas ni eliminarlas.
        </p>
      </div>
    </div>
  );
}
