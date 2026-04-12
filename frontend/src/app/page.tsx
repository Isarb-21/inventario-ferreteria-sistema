import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sistema de Ferretería</h1>
      <p className={styles.subtitle}>
        Bienvenido al panel de control central. Selecciona el módulo que deseas gestionar a continuación.
      </p>

      <div className={styles.grid}>
        <Link href="/productos" className={styles.card}>
          <div className={styles.cardIcon}>📦</div>
          <h2 className={styles.cardTitle}>Productos</h2>
          <p className={styles.cardDesc}>
            Gestiona el catálogo de productos, revisa el stock, precios y demás detalles.
          </p>
        </Link>

        <Link href="/categorias" className={styles.card}>
          <div className={styles.cardIcon}>🏷️</div>
          <h2 className={styles.cardTitle}>Categorías</h2>
          <p className={styles.cardDesc}>
            Organiza los productos de forma clara y facilita su consulta o búsqueda.
          </p>
        </Link>
      </div>
    </div>
  );
}
