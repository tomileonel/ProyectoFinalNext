import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import TagSelector from '../TagSelector';
import IngredientSelector from '../IngredientSelectorSearch';

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

    setSelectedFilters({ category, maxTime, calories });
    setTags(tagsParam);
    setIngredients(ingredientsParam);
  }, [searchParams]);

  const handleFilterSelect = (filterType) => {
    setActiveFilter((prev) => (prev === filterType ? '' : filterType));
  };

  const handleInputChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleRemoveFilter = (filterType) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: '',
    }));
    if (filterType === activeFilter) {
      setActiveFilter('');
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({ ...selectedFilters, tags, ingredients });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Filtrar recetas</h2>
        <div className={styles.scrollContainer}>
          {/* Filtro de Tiempo Máximo */}
          <div className={styles.filterItem}>
            <label 
              className={styles.filterLabel} 
              onClick={() => handleFilterSelect('maxTime')}
            >
              <strong>Tiempo Máximo</strong>
              {selectedFilters.maxTime && (
                <span 
                  className={styles.removeText} 
                  onClick={(e) => { e.stopPropagation(); handleRemoveFilter('maxTime'); }}
                >
                  Quitar
                </span>
              )}
            </label>
            {activeFilter === 'maxTime' ? (
              <>
                {selectedFilters.maxTime && (
                  <p className={styles.description}>
                    Mostra recetas en el rango seleccionado (menor a {selectedFilters.maxTime} minutos)
                  </p>
                )}
                <div className={styles.rangeContainer}>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={selectedFilters.maxTime || 1}
                    onChange={(e) => handleInputChange('maxTime', e.target.value)}
                    className={styles.range}
                    style={{ backgroundSize: `${(selectedFilters.maxTime || 1) * (100 / 120)}% 100%` }}
                  />
                  <span className={styles.selectedValue}>{selectedFilters.maxTime || 1} min</span>
                </div>
                <div className={styles.rangeLimits}>
                  <span>1 min</span>
                  <span>120 min</span>
                </div>
              </>
            ) : (
              <span className={styles.selectedTime}>{selectedFilters.maxTime || 'Selecciona un tiempo'} min</span>
            )}
          </div>

          {/* Filtro de Calorías */}
          <div className={styles.filterItem}>
            <label 
              className={styles.filterLabel} 
              onClick={() => handleFilterSelect('calories')}
            >
              <strong>Calorías</strong>
              {selectedFilters.calories && (
                <span 
                  className={styles.removeText} 
                  onClick={(e) => { e.stopPropagation(); handleRemoveFilter('calories'); }}
                >
                  Quitar
                </span>
              )}
            </label>
            {activeFilter === 'calories' ? (
              <>
                {selectedFilters.calories && (
                  <p className={styles.description}>
                    Mostra recetas en el rango seleccionado por porción (menor a {selectedFilters.calories} calorías)
                  </p>
                )}
                <div className={styles.rangeContainer}>
                  <input
                    type="range"
                    min="1"
                    max="400"
                    value={selectedFilters.calories || 1}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    className={styles.range}
                    style={{ backgroundSize: `${(selectedFilters.calories || 1) * (100 / 400)}% 100%` }}
                  />
                  <span className={styles.selectedValue}>{selectedFilters.calories || 1} kcal</span>
                </div>
                <div className={styles.rangeLimits}>
                  <span>1 kcal</span>
                  <span>400 kcal</span>
                </div>
              </>
            ) : (
              <span className={styles.selectedCalories}>{selectedFilters.calories || 'Selecciona calorías'} kcal</span>
            )}
          </div>

          {/* Selector de Etiquetas */}
          <div className={styles.filterItem}>
            <label 
              className={styles.filterLabel} 
              onClick={() => handleFilterSelect('tags')}
            >
              <strong>Categorías</strong>
              {tags.length > 0 && (
                <span 
                  className={styles.removeText} 
                  onClick={(e) => { e.stopPropagation(); setTags([]); }}
                >
                  Quitar
                </span>
              )}
            </label>
            {activeFilter === 'tags' && (
              <div>
                <TagSelector onTagsChange={setTags} selectedTags={tags} />
              </div>
            )}
          </div>

          {/* Selector de Ingredientes */}
          <div className={styles.filterItem}>
            <label 
              className={styles.filterLabel} 
              onClick={() => handleFilterSelect('ingredients')}
            >
              <strong>Ingredientes</strong>
              {ingredients.length > 0 && (
                <span 
                  className={styles.removeText} 
                  onClick={(e) => { e.stopPropagation(); setIngredients([]); }}
                >
                  Quitar
                </span>
              )}
            </label>
            {activeFilter === 'ingredients' && (
              <div>
                <IngredientSelector onIngredientsChange={setIngredients} selectedIngredients={ingredients} />
              </div>
            )}
          </div>
        </div>
        <button className={styles.applyButton} onClick={handleApplyFilters}>Aplicar</button>
      </div>
    </div>
  );
};

export default FiltersPopup;
