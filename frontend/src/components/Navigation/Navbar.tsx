"use client";
import Link from 'next/link';
import styles from './nav.module.css';

interface NavbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
  onClose: () => void;
}

export default function Navbar({ isOpen, toggleMenu, onClose }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <button 
        className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Link href="/" className={styles.brand} onClick={onClose}>
        Inventario de Ferretería
      </Link>

      <div style={{ width: '40px' }}></div> {/* Spacer for balance */}
    </nav>
  );
}
