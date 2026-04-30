// ============================================================
// app/compras/[id]/page.tsx — Detalle de una compra
// HU-05: Consultar compra por ID con detalle completo
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { comprasService, Compra } from "@/services/compras.service";
import styles from "../compra.module.css";
import { ApiError } from "@/lib/api";

export default function DetalleCompraPage() {
  const params = useParams();
  const id = Number(params.id);

  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("ID de compra inválido");
      setLoading(false);
      return;
    }

    comprasService
      .findOne(id)
      .then((data) => setCompra(data))
      .catch((err: unknown) => {
        let msg = "Error al cargar la compra";
        if (err instanceof ApiError) {
          msg = err.status === 404
            ? `La compra #${id} no existe`
            : err.messages.join(" · ");
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-GT", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>Cargando detalle de compra…</div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !compra) {
    return (
      <div className={styles.container}>
        <Link href="/compras" className={styles.backLink}>
          ← Volver a compras
        </Link>
        <div className={styles.card}>
          <div className={styles.alertError} role="alert">
            {error ?? "No se pudo cargar la compra"}
          </div>
        </div>
      </div>
    );
  }

  // ── Datos calculados ─────────────────────────────────────
  const totalItems = compra.detalles.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <div className={styles.container}>
      {/* ── Navegación ── */}
      <Link href="/compras" className={styles.backLink}>
        ← Volver al historial de compras
      </Link>

      {/* ── Encabezado ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Compra #{compra.id}</h1>
        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
          Registrada
        </span>
      </div>

      {/* ── Resumen ── */}
      <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
        <p className={styles.sectionTitle}>Información General</p>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>Proveedor</span>
            <span className={styles.infoItemValue}>
              {compra.proveedor?.nombre ?? `#${compra.proveedorId}`}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>NIT Proveedor</span>
            <span className={styles.infoItemValue}>
              {compra.proveedor?.nit ?? "—"}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>Fecha de Compra</span>
            <span className={styles.infoItemValue}>
              {formatFecha(compra.fecha)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoItemLabel}>N° de Ítems</span>
            <span className={styles.infoItemValue}>
              {compra.detalles.length} producto{compra.detalles.length !== 1 ? "s" : ""} ({totalItems} unidades)
            </span>
          </div>
          {compra.proveedor?.telefono && (
            <div className={styles.infoItem}>
              <span className={styles.infoItemLabel}>Teléfono</span>
              <span className={styles.infoItemValue}>
                {compra.proveedor.telefono}
              </span>
            </div>
          )}
          {compra.proveedor?.correo && (
            <div className={styles.infoItem}>
              <span className={styles.infoItemLabel}>Correo</span>
              <span className={styles.infoItemValue}>
                {compra.proveedor.correo}
              </span>
            </div>
          )}
        </div>

        {/* Total destacado */}
        <div className={styles.totalBox}>
          <span className={styles.totalLabel}>Total de la Compra:</span>
          <span className={styles.totalValue}>{formatMonto(compra.total)}</span>
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
              {compra.detalles.map((d, i) => {
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
          🔒 Las compras son inmutables para garantizar la trazabilidad del
          inventario. No es posible editarlas ni eliminarlas.
        </p>
      </div>
    </div>
  );
}
