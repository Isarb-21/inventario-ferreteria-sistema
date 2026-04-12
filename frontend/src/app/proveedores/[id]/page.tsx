"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { proveedoresService, Proveedor } from "@/services/proveedores.service";
import styles from "../../productos/producto.module.css";

export default function DetalleProveedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const proveedorId = parseInt(id);

  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  useEffect(() => {
    if (proveedorId) loadData();
  }, [proveedorId]);

  const loadData = async () => {
    try {
      const data = await proveedoresService.findOne(proveedorId);
      const prov = data as any;
      setProveedor(prov);
      setFormData({
        nombre: prov.nombre || "",
        nit: prov.nit || "",
        telefono: prov.telefono || "",
        correo: prov.correo || "",
        direccion: prov.direccion || "",
      });
    } catch (err: any) {
      setError(err.message || "Error al cargar proveedor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await proveedoresService.update(proveedorId, {
        nombre: formData.nombre,
        nit: formData.nit,
        telefono: formData.telefono || undefined,
        correo: formData.correo || undefined,
        direccion: formData.direccion || undefined,
      });
      setSuccess("Proveedor actualizado exitosamente");
    } catch (err: any) {
      setError(err.message || "Error al actualizar proveedor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await proveedoresService.remove(proveedorId);
      router.push("/proveedores");
    } catch (err: any) {
      setError(err.message || "Error al eliminar proveedor");
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading)
    return (
      <div className={styles.container} style={{ paddingTop: "20vh", textAlign: "center" }}>
        Cargando proveedor...
      </div>
    );

  if (!proveedor)
    return (
      <div className={styles.container} style={{ paddingTop: "20vh", textAlign: "center", color: "#ef4444" }}>
        Proveedor no encontrado
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detalle de Proveedor</h1>
        <Link href="/proveedores" className={styles.btnSecondary}>
          ← Volver
        </Link>
      </div>

      <div className={styles.card} style={{ maxWidth: "700px", margin: "0 auto" }}>
        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.error} style={{ borderLeftColor: "#10b981", color: "#047857", backgroundColor: "#ecfdf5" }}>
            {success}
          </div>
        )}

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
            />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.label}>Dirección</label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={styles.input}
              rows={3}
            />
          </div>

          <div
            className={styles.actions}
            style={{ gridColumn: "1 / -1", justifyContent: "space-between", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                type="button"
                className={showConfirm ? styles.btnDanger : styles.btnDangerOutline}
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting ? "Eliminando..." : showConfirm ? "Confirmar Borrado" : "Eliminar Proveedor"}
              </button>
              {showConfirm && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setShowConfirm(false)}
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem" }}
                >
                  Cancelar
                </button>
              )}
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={saving || deleting || showConfirm}>
              {saving ? "Guardando..." : "Actualizar Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
