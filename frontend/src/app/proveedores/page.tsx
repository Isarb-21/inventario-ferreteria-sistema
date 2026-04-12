"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { proveedoresService, Proveedor } from "@/services/proveedores.service";
import styles from "../productos/producto.module.css";

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await proveedoresService.findAll();
      if (Array.isArray(response)) {
        setProveedores(response);
      } else if (response && (response as any).data) {
        setProveedores((response as any).data);
      }
    } catch (error) {
      console.error("Error cargando proveedores", error);
    } finally {
      setLoading(false);
    }
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
      </div>
    </div>
  );
}
