"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const IngredientSelector = ({ onIngredientsChange, initialSelectedIngredients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState(initialSelectedIngredients || []);
  const [loading, setLoading] = useState(false);
  const [cant, setCantidad] = useState('');

  // Actualizar el estado inicial con los ingredientes existentes
  useEffect(() => {
    setSelectedIngredients(initialSelectedIngredients || []);
  }, [initialSelectedIngredients]);

  // Fetch de ingredientes según término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const fetchIngredients = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/api/ingredientes', {
            params: { search: searchTerm },
          });
          setFilteredOptions(response.data);
        } catch (error) {
          console.error('Error al buscar ingredientes:', error);
        }
        setLoading(false);
      };

      const debounceTimeout = setTimeout(fetchIngredients, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCantidadChange = (event) => {
    setCantidad(event.target.value);
  };

  const handleAddIngredient = (ingredient) => {
    if (cant.trim()) {
      const cantidadValue = parseFloat(cant);
      if (isNaN(cantidadValue) || cantidadValue <= 0) {
        alert('Por favor, ingrese una cant válida.');
        return;
      }

      const ingredientWithCantidad = {
        ...ingredient,
        cant: cantidadValue,
      };

      if (!selectedIngredients.some((item) => item.id === ingredient.id)) {
        const updatedSelectedIngredients = [...selectedIngredients, ingredientWithCantidad];
        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients);
      }

      setSearchTerm('');
      setCantidad('');
    } else {
      alert('Por favor, ingrese una cant.');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    const updatedSelectedIngredients = selectedIngredients.filter(
      (item) => item.id !== ingredient.id
    );
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

      <label>
        Cantidad (g):
        <input
          type="number"
          value={cant}
          onChange={handleCantidadChange}
          placeholder="Cantidad"
        />
      </label>

      {loading && <p>Buscando ingredientes...</p>}

      <ul>
        {filteredOptions.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.nombre} - {ingredient.calorias} cal/100g
            <button
              type="button"
              onClick={() => handleAddIngredient(ingredient)}
              disabled={selectedIngredients.some((item) => item.id === ingredient.id)} // Desactivar si ya está seleccionado
            >
              {selectedIngredients.some((item) => item.id === ingredient.id)
                ? 'Seleccionado'
                : 'Agregar'}
            </button>
          </li>
        ))}
      </ul>

      <h3>Ingredientes Seleccionados:</h3>
      <ul>
        {selectedIngredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.nombre} - {ingredient.cant} g
            <button type="button" onClick={() => handleRemoveIngredient(ingredient)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

IngredientSelector.propTypes = {
  onIngredientsChange: PropTypes.func.isRequired,
  initialSelectedIngredients: PropTypes.array, // Ingredientes iniciales para la receta
};

IngredientSelector.defaultProps = {
  initialSelectedIngredients: [],
};

export default IngredientSelector;
