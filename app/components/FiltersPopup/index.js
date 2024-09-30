import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import TagSelector from '../TagSelector';
import IngredientSelector from '../IngredientSelectorSearch'; // Asegúrate de importar el nuevo componente

const FiltersPopup = ({ onClose, onApplyFilters }) => {
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    maxTime: '',
    calories: '',
  });

  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const maxTime = searchParams.get('maxTime') || '';
    const calories = searchParams.get('calories') || '';
    const tagsParam = searchParams.get('tags') ? searchParams.get('tags').split(',').map(Number) : [];
    const ingredientsParam = searchParams.get('ingredients') ? searchParams.get('ingredients').split(',').map(Number) : [];

    setSelectedFilters({
      category,
      maxTime,
      calories,
    });
    setTags(tagsParam);
    setIngredients(ingredientsParam); // Almacenar los IDs de ingredientes
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters({
      ...selectedFilters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({ ...selectedFilters, tags, ingredients }); // Incluir ingredientes en los filtros aplicados
    onClose();
  };

  const handleRemoveFilter = (filterType) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: '',
    }));
    setActiveFilter('');
  };

  const handleToggleFilter = (filterType) => {
    setActiveFilter(activeFilter === filterType ? '' : filterType);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Filtrar recetas</h2>
        <div className={styles.scrollContainer}>
          <div className={styles.filterItem}>
            <label>Tiempo Máximo</label>
            <button 
              className={styles.timeButton} 
              onClick={() => handleToggleFilter('maxTime')}
            >
              {activeFilter === 'maxTime' ? "Ocultar" : "Seleccionar"}
            </button>
            {activeFilter === 'maxTime' && (
              <>
                <input
                  type="range"
                  min="1"
                  max="180" // 3 horas
                  value={selectedFilters.maxTime}
                  onChange={handleInputChange}
                  name="maxTime"
                  className={styles.range}
                />
                <span>{selectedFilters.maxTime} min</span>
                <span 
                  className={styles.removeText} 
                  onClick={() => handleRemoveFilter('maxTime')}
                >
                  Quitar
                </span>
              </>
            )}
          </div>
          <div className={styles.filterItem}>
            <label>Calorías</label>
            <button 
              className={styles.caloriesButton} 
              onClick={() => handleToggleFilter('calories')}
            >
              {activeFilter === 'calories' ? "Ocultar" : "Seleccionar"}
            </button>
            {activeFilter === 'calories' && (
              <>
                <input
                  type="range"
                  min="1"
                  max="2000"
                  value={selectedFilters.calories}
                  onChange={handleInputChange}
                  name="calories"
                  className={styles.range}
                />
                <span>{selectedFilters.calories} kcal</span>
                <span 
                  className={styles.removeText} 
                  onClick={() => handleRemoveFilter('calories')}
                >
                  Quitar
                </span>
              </>
            )}
          </div>
          <TagSelector onTagsChange={setTags} selectedTags={tags} />
          <IngredientSelector onIngredientsChange={setIngredients} /> {/* Integrar el selector de ingredientes */}
        </div>
        <button className={styles.applyButton} onClick={handleApplyFilters}>Aplicar</button>
      </div>
    </div>
  );
};

export default FiltersPopup;
