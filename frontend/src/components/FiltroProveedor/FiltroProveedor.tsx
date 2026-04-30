// ============================================================
// FiltroProveedor.tsx — Selector reutilizable de proveedor
// HU-06: Filtro por proveedor en listado de compras
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { proveedoresService, Proveedor } from "@/services/proveedores.service";
import styles from "./FiltroProveedor.module.css";

interface FiltroProveedorProps {
  /** ID del proveedor seleccionado (undefined = "Todos") */
  value: number | undefined;
  /** Callback cuando cambia la selección */
  onChange: (proveedorId: number | undefined) => void;
  /** Placeholder del primer option */
  placeholder?: string;
  /** Clase CSS adicional para el wrapper */
  className?: string;
  /** Si es true el selector está deshabilitado */
  disabled?: boolean;
}

export default function FiltroProveedor({
  value,
  onChange,
  placeholder = "Todos los proveedores",
  className,
  disabled = false,
}: FiltroProveedorProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    proveedoresService
      .findAll({ page: 1, limit: 200 }) // Carga hasta 200 proveedores para el filtro
      .then((res) => {
        if (!mounted) return;
        const lista = Array.isArray(res) ? res : res?.data ?? [];
        setProveedores(lista);
      })
      .catch((err) => console.error("Error cargando proveedores para filtro:", err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === "" ? undefined : Number(val));
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <label className={styles.label} htmlFor="filtro-proveedor">
        Proveedor
      </label>
      <div className={styles.selectWrapper}>
        <select
          id="filtro-proveedor"
          className={styles.select}
          value={value ?? ""}
          onChange={handleChange}
          disabled={disabled || loading}
          aria-label="Filtrar por proveedor"
        >
          <option value="">{loading ? "Cargando..." : placeholder}</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — {p.nit}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </div>
    </div>
  );
}
