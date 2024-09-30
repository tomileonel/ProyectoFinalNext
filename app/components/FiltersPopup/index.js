// FiltersPopup.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import TagSelector from '../TagSelector'; // Importa el TagSelector

const FiltersPopup = ({ onClose, onApplyFilters }) => {
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    maxTime: '',
    calories: '',
  });

  const [tags, setTags] = useState([]);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const maxTime = searchParams.get('maxTime') || '';
    const calories = searchParams.get('calories') || '';

    setSelectedFilters({
      category,
      maxTime,
      calories,
    });
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters({
      ...selectedFilters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({ ...selectedFilters, tags });
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
        <TagSelector onTagsChange={setTags} /> {/* Añadir el TagSelector */}
        <button className={styles.applyButton} onClick={handleApplyFilters}>Aplicar</button>
        <button className={styles.closeButton} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default FiltersPopup;
