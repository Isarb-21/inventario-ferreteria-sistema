"use client";
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './nav.module.css';

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <Navbar isOpen={isOpen} toggleMenu={toggleMenu} onClose={closeMenu} />
      <Sidebar isOpen={isOpen} onClose={closeMenu} />
      <main className={`${styles.contentWrapper} ${isOpen ? styles.pushed : ''}`}>
        {children}
      </main>
    </>
  );
}
