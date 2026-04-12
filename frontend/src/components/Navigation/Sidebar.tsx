"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Inicio', path: '/', icon: '🏠' },
    { name: 'Productos', path: '/productos', icon: '📦' },
    { name: 'Categorías', path: '/categorias', icon: '🏷️' },
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
      </nav>
    </aside>
  );
}
