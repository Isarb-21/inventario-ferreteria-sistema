"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { categoriasService, Categoria } from "@/services/categorias.service";
import styles from "./categoria.module.css";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await categoriasService.findAll();
      // Adjusting if backend returns data payload or just array
      if (response && Array.isArray(response)) {
        setCategorias(response);
      } else if (response && (response as any).data) {
        setCategorias((response as any).data);
      }
    } catch (error) {
      console.error("Error cargando categorías", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Categorías</h1>
        <Link href="/categorias/new" className={styles.btnPrimary}>
          + Nueva Categoría
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id}>
                  <td><span className={styles.badge}>#{cat.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{cat.nombre}</td>
                  <td>{cat.descripcion || "-"}</td>
                  <td>
                    <Link href={`/categorias/${cat.id}`} className={styles.btnAction}>
                      Detalles / Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay categorías registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
