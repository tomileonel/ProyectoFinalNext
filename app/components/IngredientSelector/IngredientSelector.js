"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const IngredientSelector = ({ ingredientOptions, onIngredientsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    // Verifica que ingredientOptions es un array antes de usar filter
    if (Array.isArray(ingredientOptions)) {
      setFilteredOptions(
        ingredientOptions.filter(option =>
          option.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, ingredientOptions]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddIngredient = (ingredient) => {
    if (!selectedIngredients.some(item => item.id === ingredient.id)) {
      const updatedSelectedIngredients = [...selectedIngredients, ingredient];
      setSelectedIngredients(updatedSelectedIngredients);
      onIngredientsChange(updatedSelectedIngredients);
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    const updatedSelectedIngredients = selectedIngredients.filter(item => item.id !== ingredient.id);
    setSelectedIngredients(updatedSelectedIngredients);
    onIngredientsChange(updatedSelectedIngredients);
  };

  return (
    <div>
      <label>
        Buscar Ingrediente:
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar ingrediente"
        />
      </label>
      <div>
        <h3>Opciones:</h3>
        <ul>
          {Array.isArray(filteredOptions) && filteredOptions.map(option => (
            <li key={option.id}>
              <button type="button" onClick={() => handleAddIngredient(option)}>
                Agregar {option.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Ingredientes Seleccionados:</h3>
        <ul>
          {Array.isArray(selectedIngredients) && selectedIngredients.map(ingredient => (
            <li key={ingredient.id}>
              {ingredient.name}
              <button type="button" onClick={() => handleRemoveIngredient(ingredient)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

IngredientSelector.propTypes = {
  ingredientOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onIngredientsChange: PropTypes.func.isRequired,
};

export default IngredientSelector;
