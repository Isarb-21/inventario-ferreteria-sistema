"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { productosService, Producto } from "@/services/productos.service";
import { api } from "@/lib/api";
import Link from "next/link";
import styles from "../producto.module.css";

export default function ProductoDetallePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const idValue = idStr ? parseInt(idStr) : 0;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoriaId: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: ""
  });

  useEffect(() => {
    if (idValue) {
      loadData();
    }
  }, [idValue]);

  const loadData = async () => {
    try {
      const [prod, catRes, provRes] = await Promise.all([
        productosService.findOne(idValue),
        api.get<any>("/categoria"),
        productosService.findProveedores(idValue)
      ]);
      const data = prod;
      setProducto(data);
      setFormData({
        nombre: data.nombre,
        codigo: data.codigo,
        categoriaId: data.categoriaId.toString(),
        precioCompra: data.precioCompra.toString(),
        precioVenta: data.precioVenta.toString(),
        stock: data.stock.toString(),
        stockMinimo: data.stockMinimo.toString()
      });
      const cats = Array.isArray(catRes) ? catRes : catRes?.data || [];
      setCategorias(cats);

      const provs = (provRes as any)?.data || provRes;
      setProveedores(Array.isArray(provs) ? provs.map((p: any) => p.proveedor) : []);
    } catch (err: any) {
      setError(err.message || "Error al cargar producto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const precioCompra = parseFloat(formData.precioCompra);
    const precioVenta = parseFloat(formData.precioVenta);
    if (precioVenta < precioCompra) {
      setError("El precio de venta debe ser mayor o igual al precio de compra.");
      setSaving(false);
      return;
    }

    try {
      await productosService.update(idValue, {
        nombre: formData.nombre,
        codigo: formData.codigo,
        categoriaId: parseInt(formData.categoriaId),
        precioCompra,
        precioVenta,
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo)
      });
      setSuccess("Producto actualizado exitosamente!");
    } catch (err: any) {
      setError(err.message || "Error al actualizar producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await productosService.remove(idValue);
      router.push("/productos");
    } catch (err: any) {
      setError(err.message || "Error al eliminar producto");
      setDeleting(false);
    }
  };

  if (loading) return <div className={styles.container} style={{ paddingTop: '20vh', textAlign: 'center', fontWeight: 'bold' }}>Cargando datos del producto...</div>;
  if (!producto) return <div className={styles.container} style={{ paddingTop: '20vh', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>Producto no encontrado</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Detalle de Producto</h1>
      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.error} style={{ borderLeftColor: '#10b981', color: '#047857', backgroundColor: '#ecfdf5' }}>{success}</div>}
        <form onSubmit={handleSubmit} className={styles.gridForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre</label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Código</label>
            <input required type="text" name="codigo" value={formData.codigo} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Categoría</label>
            <select required name="categoriaId" value={formData.categoriaId} onChange={handleChange} className={styles.select}>
              <option value="">Selecciona una categoría...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Actual</label>
            <input required type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Mínimo</label>
            <input required type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} min="0" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio Compra</label>
            <input required type="number" step="0.01" name="precioCompra" value={formData.precioCompra} onChange={handleChange} min="0" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio Venta</label>
            <input required type="number" step="0.01" name="precioVenta" value={formData.precioVenta} onChange={handleChange} min="0" className={styles.input} />
          </div>
          
          <div className={styles.actions} style={{ gridColumn: '1 / -1', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/productos" className={styles.btnSecondary}>Volver</Link>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Guardando...' : 'Actualizar Producto'}
              </button>
            </div>
            <button type="button" onClick={handleDelete} className={styles.btnDangerOutline} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar Producto'}
            </button>
          </div>
        </form>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem' }}>Proveedores Asociados</h3>
          {proveedores.length === 0 ? (
            <div style={{ padding: '1rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#be123c', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span> Este producto no tiene un proveedor asociado. Asigna uno en la sección Proveedores para facilitar el reabastecimiento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {proveedores.map(prov => (
                <Link key={prov.id} href={`/proveedores/${prov.id}`} style={{ textDecoration: 'none' }}>
                  <div 
                    title="Ver detalle del proveedor"
                    style={{ 
                      padding: '0.5rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', 
                      color: '#334155', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', 
                      alignItems: 'center', gap: '0.4rem', borderRadius: '20px', transition: 'all 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }} 
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor='#f1f5f9'; e.currentTarget.style.borderColor='#94a3b8'; }} 
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor='#f8fafc'; e.currentTarget.style.borderColor='#cbd5e1'; }}
                  >
                    🏢 <span style={{ fontWeight: 500 }}>{prov.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
