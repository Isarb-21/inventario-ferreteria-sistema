"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categoriasService } from "@/services/categorias.service";
import styles from "../categoria.module.css";

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.nombre.trim()) {
        throw new Error("El nombre es requerido");
      }
      
      await categoriasService.create({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
      });

      router.push("/categorias");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Error al crear la categoría"
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nueva Categoría</h1>
        <Link href="/categorias" className={styles.btnSecondary}>
          &larr; Volver
        </Link>
      </div>

      <div className={styles.card} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.gridForm} style={{ gridTemplateColumns: '1fr' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre de Categoría *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              placeholder="Ej. Herramientas Eléctricas"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.input}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Detalle opcional sobre esta categoría"
              rows={4}
            />
          </div>

          <div className={styles.actions} style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Link href="/categorias" className={styles.btnSecondary} style={{ color: 'var(--foreground)', borderColor: '#d1d5db' }}>
              Cancelar
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Guardando..." : "Guardar Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
