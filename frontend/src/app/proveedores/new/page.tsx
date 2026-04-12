"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { proveedoresService } from "@/services/proveedores.service";
import styles from "../../productos/producto.module.css";

export default function NuevoProveedorPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await proveedoresService.create({
        nombre: formData.nombre,
        nit: formData.nit,
        telefono: formData.telefono || undefined,
        correo: formData.correo || undefined,
        direccion: formData.direccion || undefined,
      });
      router.push("/proveedores");
    } catch (err: any) {
      setError(err.message || "Error al crear proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuevo Proveedor</h1>
        <Link href="/proveedores" className={styles.btnSecondary}>
          ← Volver
        </Link>
      </div>

      <div className={styles.card} style={{ maxWidth: "700px", margin: "0 auto" }}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.gridForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre del Proveedor *</label>
            <input
              required
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej. Distribuidora Ferretería Norte"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>NIT *</label>
            <input
              required
              type="text"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej. 900123456-7"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej. 601-234-5678"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={styles.input}
              placeholder="contacto@proveedor.com"
            />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.label}>Dirección</label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={styles.input}
              placeholder="Dirección física del proveedor"
              rows={3}
            />
          </div>

          <div className={styles.actions} style={{ gridColumn: "1 / -1" }}>
            <Link href="/proveedores" className={styles.btnSecondary}>
              Cancelar
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Guardando..." : "Registrar Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
