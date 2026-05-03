"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './nav.module.css';
import { productosService } from '@/services/productos.service';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  // Badge de stock bajo — se refresca al montar el Sidebar
  const [stockBajoCount, setStockBajoCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    productosService
      .findStockBajo()
      .then((data) => {
        if (mounted) {
          const lista = Array.isArray(data) ? data : [];
          setStockBajoCount(lista.length);
        }
      })
      .catch(() => {
        // Silencioso: no bloquear la navegación si falla
        if (mounted) setStockBajoCount(null);
      });
    return () => { mounted = false; };
  }, []);

  const navItems = [
    { name: 'Inicio', path: '/', icon: '🏠' },
    { name: 'Productos', path: '/productos', icon: '📦' },
    { name: 'Categorías', path: '/categorias', icon: '🏷️' },
    { name: 'Proveedores', path: '/proveedores', icon: '🚚' },
    { name: 'Compras', path: '/compras', icon: '🛒' },
    { name: 'Ventas', path: '/ventas', icon: '💰' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.navLinks}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className={`${styles.navLink} ${
              pathname === item.path ? styles.navLinkActive : ''
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}

        {/* ── HU-09: Stock Bajo con badge de alerta ── */}
        <Link
          href="/stock-bajo"
          onClick={onClose}
          className={`${styles.navLink} ${
            pathname === '/stock-bajo' ? styles.navLinkActive : ''
          } ${styles.navLinkAlert}`}
          id="nav-stock-bajo"
        >
          <span>⚠️</span>
          Stock Bajo
          {stockBajoCount !== null && stockBajoCount > 0 && (
            <span className={styles.navBadge}>{stockBajoCount}</span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
