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

        <Link href="/proveedores" className={styles.card}>
          <div className={styles.cardIcon}>🏢</div>
          <h2 className={styles.cardTitle}>Proveedores</h2>
          <p className={styles.cardDesc}>
            Administra tus proveedores, su información de contacto y productos asociados.
          </p>
        </Link>

        <Link href="/compras" className={styles.card}>
          <div className={styles.cardIcon}>🛒</div>
          <h2 className={styles.cardTitle}>Compras</h2>
          <p className={styles.cardDesc}>
            Registra compras a proveedores y consulta el historial de abastecimiento.
          </p>
        </Link>

        <Link href="/ventas" className={styles.card}>
          <div className={styles.cardIcon}>💰</div>
          <h2 className={styles.cardTitle}>Ventas</h2>
          <p className={styles.cardDesc}>
            Registra ventas al público y consulta el historial de movimientos del día.
          </p>
        </Link>

        {/* ── HU-09: Alertas de Stock Bajo ── */}
        <Link href="/stock-bajo" className={`${styles.card} ${styles.cardAlert}`}>
          <div className={styles.cardIcon}>⚠️</div>
          <h2 className={styles.cardTitle}>Stock Bajo</h2>
          <p className={styles.cardDesc}>
            Consulta los productos con stock inferior al mínimo y programa reabastecimiento.
          </p>
        </Link>
      </div>
    </div>
  );
}
