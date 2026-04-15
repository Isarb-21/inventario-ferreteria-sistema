"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { proveedoresService, Proveedor } from "@/services/proveedores.service";
import styles from "../productos/producto.module.css";

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchProveedores();
  }, [page]);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const response = await proveedoresService.findAll({ page, limit });
      if (response && response.data && Array.isArray(response.data)) {
        setProveedores(response.data);
        setTotal(response.total);
      } else if (Array.isArray(response)) {
        setProveedores(response);
      }
    } catch (error) {
      console.error("Error cargando proveedores", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (page * limit < total) setPage(p => p + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Proveedores</h1>
        <Link href="/proveedores/new" className={styles.btnPrimary}>
          + Nuevo Proveedor
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Cargando proveedores...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NIT</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((prov) => (
                  <tr key={prov.id}>
                    <td><span className={styles.badge}>{prov.nit}</span></td>
                    <td style={{ fontWeight: 600 }}>{prov.nombre}</td>
                    <td>{prov.telefono || "-"}</td>
                    <td>{prov.correo || "-"}</td>
                    <td>{prov.direccion || "-"}</td>
                    <td>
                      <Link href={`/proveedores/${prov.id}`} className={styles.btnAction}>
                        Detalles / Editar
                      </Link>
                    </td>
                  </tr>
                ))}
                {proveedores.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                      No hay proveedores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && total > 0 && (
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
