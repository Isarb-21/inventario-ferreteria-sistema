"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productosService } from "@/services/productos.service";
import { api } from "@/lib/api"; // generic fallback for categorias if category service is limited
import Link from "next/link";
import styles from "../producto.module.css";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoriaId: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "0"
  });

  useEffect(() => {
    api.get<any>("/categoria").then(res => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setCategorias(data);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const precioCompra = parseFloat(formData.precioCompra);
    const precioVenta = parseFloat(formData.precioVenta);
    if (precioVenta < precioCompra) {
      setError("El precio de venta debe ser mayor o igual al precio de compra.");
      setLoading(false);
      return;
    }

    try {
      await productosService.create({
        nombre: formData.nombre,
        codigo: formData.codigo,
        categoriaId: parseInt(formData.categoriaId),
        precioCompra,
        precioVenta,
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo)
      });
      router.push("/productos");
    } catch (err: any) {
      setError(err.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Registrar Producto</h1>
      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
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
            <label className={styles.label}>Stock Inicial</label>
            <input required type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className={styles.input} placeholder="0" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Mínimo</label>
            <input required type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} min="0" className={styles.input} placeholder="0" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio Compra</label>
            <input required type="number" step="0.01" name="precioCompra" value={formData.precioCompra} onChange={handleChange} min="0" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio Venta</label>
            <input required type="number" step="0.01" name="precioVenta" value={formData.precioVenta} onChange={handleChange} min="0" className={styles.input} />
          </div>
          
          <div className={styles.actions} style={{ gridColumn: '1 / -1' }}>
            <Link href="/productos" className={styles.btnSecondary}>Cancelar</Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
