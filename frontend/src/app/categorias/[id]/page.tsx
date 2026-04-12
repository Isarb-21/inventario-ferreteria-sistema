"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categoriasService } from "@/services/categorias.service";
import styles from "../categoria.module.css";

export default function DetalleCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const categoriaId = parseInt(id);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchCategoria();
  }, [categoriaId]);

  const fetchCategoria = async () => {
    try {
      const response = await categoriasService.findOne(categoriaId);
      const cat = response as any;
      setFormData({
        nombre: cat.nombre || "",
        descripcion: cat.descripcion || "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la categoría");
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await categoriasService.update(categoriaId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
      });
      router.push("/categorias");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error al actualizar la categoría"
      );
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // Si es el primer click, solo mostramos el estado de confirmación
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    // Segundo click: proceder con el borrado
    setDeleting(true);
    setError(null);

    try {
      await categoriasService.remove(categoriaId);
      router.push("/categorias");
    } catch (err: any) {
      const mensaje = err.messages?.[0] || "No se pudo eliminar la categoría";
      setError(mensaje);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><div style={{padding: '2rem', textAlign: 'center'}}>Cargando...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Editar Categoría</h1>
        <Link href="/categorias" className={styles.btnSecondary}>
          &larr; Volver
        </Link>
      </div>

      <div className={styles.card} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleUpdate} className={styles.gridForm} style={{ gridTemplateColumns: '1fr' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre de Categoría *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.input}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
            />
          </div>

          <div className={styles.actions} style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={showConfirm ? styles.btnDanger : styles.btnDangerOutline}
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting ? "Eliminando..." : showConfirm ? "Confirmar Borrado" : "Eliminar Categoría"}
              </button>
              {showConfirm && (
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={() => setShowConfirm(false)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  Cancelar
                </button>
              )}
            </div>
            
            <button type="submit" className={styles.btnPrimary} disabled={saving || deleting || showConfirm}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
