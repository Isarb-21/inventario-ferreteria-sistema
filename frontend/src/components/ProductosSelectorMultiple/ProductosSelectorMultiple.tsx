import React, { useState, useMemo } from 'react';
import styles from './ProductosSelectorMultiple.module.css';
import { Producto } from '@/services/productos.service';

interface ProductosSelectorMultipleProps {
  productos: Producto[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  isLoading?: boolean;
}

export const ProductosSelectorMultiple: React.FC<ProductosSelectorMultipleProps> = ({
  productos,
  selectedIds,
  onChange,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProductos = useMemo(() => {
    if (!searchTerm.trim()) return productos;
    const lowerSearch = searchTerm.toLowerCase();
    return productos.filter(
      p => p.nombre.toLowerCase().includes(lowerSearch) || p.codigo.toLowerCase().includes(lowerSearch)
    );
  }, [productos, searchTerm]);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return <div className={styles.container}>Cargando productos...</div>;
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#334155', margin: 0 }}>Productos Suministrados</h3>
        <span className={styles.selectedCount}>
          {selectedIds.length} producto(s) seleccionado(s)
        </span>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar producto por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.productsGrid}>
        {filteredProductos.length === 0 ? (
          <div style={{ padding: '1rem', color: '#64748b', gridColumn: '1 / -1', textAlign: 'center' }}>
            No se encontraron productos.
          </div>
        ) : (
          filteredProductos.map(producto => {
            const isSelected = selectedIds.includes(producto.id);
            return (
              <div
                key={producto.id}
                className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => toggleSelect(producto.id)}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isSelected}
                  onChange={() => {}} // Handle change is managed by the div wrapper onClick
                  onClick={(e) => e.stopPropagation()} // Prevent double firing
                  readOnly
                />
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{producto.nombre}</span>
                  <span className={styles.productCode}>SKU: {producto.codigo}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
