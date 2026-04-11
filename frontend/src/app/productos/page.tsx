"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { productosService, Producto } from "@/services/productos.service";
import styles from "./producto.module.css";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchProductos();
  }, [page]);

  const fetchProductos = async () => {
    try {
      const response = await productosService.findAll({ page, limit });
      if (response && Array.isArray(response.data)) {
         setProductos(response.data);
         setTotal(response.total);
      } else if (Array.isArray(response)) {
         setProductos(response);
      }
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const handleNext = () => {
    if (page * limit < total) setPage(p => p + 1);
  }

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Catálogo de Productos</h1>
        <Link href="/productos/new" className={styles.btnPrimary}>
          + Nuevo Producto
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>P. Compra</th>
                <th>P. Venta</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  <td><span className={styles.badge}>{prod.codigo}</span></td>
                  <td>{prod.nombre}</td>
                  <td>{prod.categoria?.nombre || "-"}</td>
                  <td>${Number(prod.precioCompra).toFixed(2)}</td>
                  <td>${Number(prod.precioVenta).toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <Link href={`/productos/${prod.id}`} className={styles.btnAction}>
                      Detalles / Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className={styles.pagination}>
            <button 
              className={styles.btnSecondary} 
              onClick={handlePrev} 
              disabled={page === 1}
              style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>Página {page} de {Math.ceil(total / limit) || 1}</span>
            <button 
              className={styles.btnSecondary} 
              onClick={handleNext} 
              disabled={page * limit >= total}
              style={{ opacity: page * limit >= total ? 0.5 : 1, cursor: page * limit >= total ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
