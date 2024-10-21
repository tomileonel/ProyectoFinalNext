"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const IngredientSelector = ({ onIngredientsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState('');  // Cambié 'quantity' por 'cantidad' para consistencia

  // Fetch de ingredientes según término de búsqueda
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

  const handleCantidadChange = (event) => {
    setCantidad(event.target.value);  // Cambié 'quantity' por 'cantidad'
  };

  const handleAddIngredient = (ingredient) => {
    if (cantidad.trim()) {
      const cantidadValue = parseFloat(cantidad);  // Asegúrate de convertir a float
      if (isNaN(cantidadValue) || cantidadValue <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
      }

      const ingredientWithCantidad = {
        ...ingredient,
        cantidad: cantidadValue,  // Cambié 'quantity' por 'cantidad'
      };

      // Evita duplicados
      if (!selectedIngredients.some(item => item.id === ingredient.id)) {
        const updatedSelectedIngredients = [...selectedIngredients, ingredientWithCantidad];
        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients);  // Pasar la lista actualizada al componente padre
      }

      // Resetea campos
      setSearchTerm('');
      setCantidad('');
    } else {
      alert('Por favor, ingrese una cantidad.');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    const updatedSelectedIngredients = selectedIngredients.filter(item => item.id !== ingredient.id);
    setSelectedIngredients(updatedSelectedIngredients);
    onIngredientsChange(updatedSelectedIngredients);  // Pasar la lista actualizada al componente padre
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
          value={cantidad}  // Cambié 'quantity' por 'cantidad'
          onChange={handleCantidadChange}
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
            {ingredient.name} - {ingredient.cantidad} g  {/* Mostrar 'cantidad' */}
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
