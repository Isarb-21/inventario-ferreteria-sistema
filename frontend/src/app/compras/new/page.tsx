// ============================================================
// app/compras/new/page.tsx — Formulario de nueva compra
// HU-05: Registro de Compra a Proveedor
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { comprasService, CompraDetalleInput } from "@/services/compras.service";
import { productosService, Producto } from "@/services/productos.service";
import FiltroProveedor from "@/components/FiltroProveedor/FiltroProveedor";
import styles from "../compra.module.css";
import { ApiError } from "@/lib/api";

// ── Tipos internos del formulario ────────────────────────────
interface FilaDetalle {
  _key: number;           // clave React estable
  productoId: number | "";
  cantidad: number | "";
  precioUnitario: number | "";
}

interface FormErrors {
  proveedor?: string;
  detalles?: string;
  general?: string;
  filas?: Record<number, { productoId?: string; cantidad?: string; precioUnitario?: string }>;
}

let nextKey = 1;
const nuevaFila = (): FilaDetalle => ({
  _key: nextKey++,
  productoId: "",
  cantidad: "",
  precioUnitario: "",
});

export default function NuevaCompraPage() {
  const router = useRouter();

  // ── Estado del formulario ────────────────────────────────
  const [proveedorId, setProveedorId] = useState<number | undefined>(undefined);
  const [filas, setFilas] = useState<FilaDetalle[]>([nuevaFila()]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Catálogo de productos (para los selects) ─────────────
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    let mounted = true;
    productosService
      .findAll({ page: 1, limit: 500 })
      .then((res) => {
        if (!mounted) return;
        const lista = Array.isArray(res) ? res : res?.data ?? [];
        setProductos(lista);
      })
      .catch(() => {/* silencioso, se mostrará select vacío */})
      .finally(() => { if (mounted) setLoadingProductos(false); });
    return () => { mounted = false; };
  }, []);

  // ── Cálculo de total en tiempo real ─────────────────────
  const total = filas.reduce((acc, f) => {
    const cant = Number(f.cantidad) || 0;
    const precio = Number(f.precioUnitario) || 0;
    return acc + cant * precio;
  }, 0);

  // ── Precio unitario sugerido al elegir producto ──────────
  const handleProductoSelect = useCallback(
    (key: number, productoId: number | "") => {
      setFilas((prev) =>
        prev.map((f) => {
          if (f._key !== key) return f;
          // Pre-llenar con precioCompra del producto seleccionado
          const prod = productos.find((p) => p.id === Number(productoId));
          return {
            ...f,
            productoId,
            precioUnitario: prod ? prod.precioCompra : f.precioUnitario,
          };
        })
      );
    },
    [productos]
  );

  const updateFila = (
    key: number,
    campo: keyof Omit<FilaDetalle, "_key">,
    valor: number | ""
  ) => {
    setFilas((prev) =>
      prev.map((f) => (f._key === key ? { ...f, [campo]: valor } : f))
    );
  };

  const agregarFila = () => setFilas((prev) => [...prev, nuevaFila()]);

  const eliminarFila = (key: number) => {
    if (filas.length === 1) return; // mínimo 1
    setFilas((prev) => prev.filter((f) => f._key !== key));
  };

  // ── Validación del formulario ────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = { filas: {} };
    let valid = true;

    if (!proveedorId) {
      newErrors.proveedor = "Debes seleccionar un proveedor";
      valid = false;
    }

    const productoIdsUsados: number[] = [];

    filas.forEach((f) => {
      const filaErrors: NonNullable<FormErrors["filas"]>[number] = {};

      if (f.productoId === "") {
        filaErrors.productoId = "Selecciona un producto";
        valid = false;
      } else {
        if (productoIdsUsados.includes(Number(f.productoId))) {
          filaErrors.productoId = "Producto duplicado en el detalle";
          valid = false;
        } else {
          productoIdsUsados.push(Number(f.productoId));
        }
      }

      if (f.cantidad === "" || Number(f.cantidad) < 1 || !Number.isInteger(Number(f.cantidad))) {
        filaErrors.cantidad = "Cantidad entera ≥ 1";
        valid = false;
      }

      if (f.precioUnitario === "" || Number(f.precioUnitario) <= 0) {
        filaErrors.precioUnitario = "Precio > 0";
        valid = false;
      }

      if (Object.keys(filaErrors).length > 0) {
        newErrors.filas![f._key] = filaErrors;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    const detalles: CompraDetalleInput[] = filas.map((f) => ({
      productoId: Number(f.productoId),
      cantidad: Number(f.cantidad),
      precioUnitario: Number(f.precioUnitario),
    }));

    try {
      await comprasService.create({ proveedorId: proveedorId!, detalles });
      router.push("/compras");
    } catch (err: unknown) {
      let msg = "Error al registrar la compra. Intenta de nuevo.";
      if (err instanceof ApiError) {
        msg = err.messages.join(" · ");
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrors({ general: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const formatMonto = (n: number) =>
    new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(n);

  // ── Render ───────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nueva Compra</h1>

      <div className={styles.card} style={{ marginTop: "1.5rem" }}>
        <form onSubmit={handleSubmit} noValidate id="form-nueva-compra">

          {/* Error general */}
          {errors.general && (
            <div className={styles.alertError} role="alert">
              {errors.general}
            </div>
          )}

          {/* ── Sección: Proveedor ── */}
          <p className={styles.sectionTitle}>Datos de la Compra</p>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <FiltroProveedor
                value={proveedorId}
                onChange={setProveedorId}
                placeholder="— Selecciona un proveedor —"
              />
              {errors.proveedor && (
                <span className={styles.fieldError}>{errors.proveedor}</span>
              )}
            </div>
          </div>

          {/* ── Sección: Detalle de productos ── */}
          <div className={styles.itemsSection}>
            <div className={styles.itemsSectionHeader}>
              <p className={styles.sectionTitle} style={{ margin: 0 }}>
                Detalle de Productos
              </p>
            </div>

            {errors.detalles && (
              <div className={styles.alertError} role="alert">
                {errors.detalles}
              </div>
            )}

            <div className={styles.tableWrapper}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Producto</th>
                    <th style={{ width: "18%" }}>Cantidad</th>
                    <th style={{ width: "22%" }}>Precio Unitario (Q)</th>
                    <th style={{ width: "12%" }}>Subtotal</th>
                    <th style={{ width: "8%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila) => {
                    const filaErr = errors.filas?.[fila._key] ?? {};
                    const subtotal =
                      (Number(fila.cantidad) || 0) * (Number(fila.precioUnitario) || 0);
                    return (
                      <tr key={fila._key}>
                        {/* Producto */}
                        <td>
                          <select
                            className={`${styles.itemInput} ${filaErr.productoId ? styles.inputError : ""}`}
                            value={fila.productoId}
                            onChange={(e) =>
                              handleProductoSelect(fila._key, e.target.value === "" ? "" : Number(e.target.value))
                            }
                            id={`select-producto-${fila._key}`}
                            disabled={loadingProductos}
                            aria-label="Producto"
                          >
                            <option value="">
                              {loadingProductos ? "Cargando..." : "— Elige producto —"}
                            </option>
                            {productos.map((p) => (
                              <option key={p.id} value={p.id}>
                                [{p.codigo}] {p.nombre} (Stock: {p.stock})
                              </option>
                            ))}
                          </select>
                          {filaErr.productoId && (
                            <p className={styles.fieldError}>{filaErr.productoId}</p>
                          )}
                        </td>

                        {/* Cantidad */}
                        <td>
                          <input
                            type="number"
                            className={`${styles.itemInput} ${filaErr.cantidad ? styles.inputError : ""}`}
                            value={fila.cantidad}
                            min={1}
                            step={1}
                            onChange={(e) =>
                              updateFila(
                                fila._key,
                                "cantidad",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            id={`input-cantidad-${fila._key}`}
                            placeholder="0"
                            aria-label="Cantidad"
                          />
                          {filaErr.cantidad && (
                            <p className={styles.fieldError}>{filaErr.cantidad}</p>
                          )}
                        </td>

                        {/* Precio Unitario */}
                        <td>
                          <input
                            type="number"
                            className={`${styles.itemInput} ${filaErr.precioUnitario ? styles.inputError : ""}`}
                            value={fila.precioUnitario}
                            min={0.0001}
                            step={0.01}
                            onChange={(e) =>
                              updateFila(
                                fila._key,
                                "precioUnitario",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            id={`input-precio-${fila._key}`}
                            placeholder="0.00"
                            aria-label="Precio unitario"
                          />
                          {filaErr.precioUnitario && (
                            <p className={styles.fieldError}>{filaErr.precioUnitario}</p>
                          )}
                        </td>

                        {/* Subtotal */}
                        <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                          {formatMonto(subtotal)}
                        </td>

                        {/* Eliminar fila */}
                        <td>
                          <button
                            type="button"
                            className={styles.btnRemoveItem}
                            onClick={() => eliminarFila(fila._key)}
                            disabled={filas.length === 1}
                            title="Eliminar línea"
                            aria-label="Eliminar línea de producto"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Botón agregar fila */}
            <button
              type="button"
              className={styles.btnAddItem}
              onClick={agregarFila}
              id="btn-agregar-producto"
            >
              + Agregar otro producto
            </button>

            {/* Total calculado */}
            <div className={styles.totalBox}>
              <span className={styles.totalLabel}>Total de la Compra:</span>
              <span className={styles.totalValue}>{formatMonto(total)}</span>
            </div>
          </div>

          {/* ── Acciones ── */}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={submitting}
              id="btn-guardar-compra"
            >
              {submitting ? "Guardando…" : "✓ Registrar Compra"}
            </button>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => router.push("/compras")}
              disabled={submitting}
              id="btn-cancelar-compra"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
