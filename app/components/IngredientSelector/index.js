"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const IngredientSelector = ({ onIngredientsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (searchTerm) {
      const fetchIngredients = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/api/ingredientes', {
            params: { search: searchTerm }
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

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddIngredient = (ingredient) => {
    if (quantity.trim()) {
      const quantityValue = parseInt(quantity, 10);
      if (isNaN(quantityValue) || quantityValue <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
      }

      const ingredientWithQuantity = {
        ...ingredient,
        quantity: quantityValue,
      };

      // Evita duplicados
      if (!selectedIngredients.some(item => item.id === ingredient.id)) {
        const updatedSelectedIngredients = [...selectedIngredients, ingredientWithQuantity];
        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients);
      }

      // Resetea campos
      setSearchTerm('');
      setQuantity('');
    } else {
      alert('Por favor, ingrese una cantidad.');
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

      <label>
        Cantidad (g):
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Cantidad"
        />
      </label>

      {loading && <p>Buscando ingredientes...</p>}

      <ul>
        {filteredOptions.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {ingredient.calorias} cal/100g
            <button type="button" onClick={() => handleAddIngredient(ingredient)}>Agregar</button>
          </li>
        ))}
      </ul>

      <h3>Ingredientes Seleccionados:</h3>
      <ul>
        {selectedIngredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {ingredient.quantity} g
            <button type="button" onClick={() => handleRemoveIngredient(ingredient)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

IngredientSelector.propTypes = {
  onIngredientsChange: PropTypes.func.isRequired,
};

export default IngredientSelector;
