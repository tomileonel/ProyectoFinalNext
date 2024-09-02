import React, { useState } from 'react';
import styles from './styles.module.css';

const FiltersPopup = ({ onClose, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    minTime: '',
    maxTime: '',
    calories: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters({
      ...selectedFilters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <h2>Filtrar recetas</h2>
        <div className={styles.filterItem}>
          <label>Categoría</label>
          <input 
            name="category" 
            value={selectedFilters.category} 
            onChange={handleInputChange} 
            type="text" 
          />
        </div>
        <div className={styles.filterItem}>
          <label>Tiempo Mínimo (min)</label>
          <input 
            name="minTime" 
            value={selectedFilters.minTime} 
            onChange={handleInputChange} 
            type="number" 
          />
        </div>
        <div className={styles.filterItem}>
          <label>Tiempo Máximo (min)</label>
          <input 
            name="maxTime" 
            value={selectedFilters.maxTime} 
            onChange={handleInputChange} 
            type="number" 
          />
        </div>
        <div className={styles.filterItem}>
          <label>Calorías</label>
          <input 
            name="calories" 
            value={selectedFilters.calories} 
            onChange={handleInputChange} 
            type="number" 
          />
        </div>
        <button className={styles.applyButton} onClick={handleApplyFilters}>Aplicar</button>
        <button className={styles.closeButton} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default FiltersPopup;
