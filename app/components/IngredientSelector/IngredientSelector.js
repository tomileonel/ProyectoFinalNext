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
  const [nutritionInfo, setNutritionInfo] = useState({
    calorias: 0,
    carbohidratos: 0,
    proteina: 0,
    grasas: 0,
  });

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
      const quantityValue = parseInt(quantity, 10); // Convertir a entero
      if (isNaN(quantityValue) || quantityValue <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
      }
  
      const factor = quantityValue / 100;
      const calorias = ingredient.calorias ? parseFloat(ingredient.calorias) : 0;
      const carbohidratos = ingredient.carbohidratos ? parseFloat(ingredient.carbohidratos) : 0;
      const proteina = ingredient.proteina ? parseFloat(ingredient.proteina) : 0;
      const grasas = ingredient.grasas ? parseFloat(ingredient.grasas) : 0;
  
      const ingredientWithQuantity = {
        ...ingredient,
        quantity: `${quantityValue} g`, // Asegúrate de que se esté guardando correctamente
        calorias: (calorias * factor).toFixed(2),
        carbohidratos: (carbohidratos * factor).toFixed(2),
        proteina: (proteina * factor).toFixed(2),
        grasas: (grasas * factor).toFixed(2),
      };
  
      // Solo añadir si no existe ya
      if (!selectedIngredients.some(item => item.id === ingredient.id)) {
        const updatedSelectedIngredients = [...selectedIngredients, ingredientWithQuantity];
        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients);
        updateNutritionInfo(updatedSelectedIngredients);
      }
  
      setSearchTerm('');
      setQuantity('');
    } else {
      alert('Por favor, ingrese una cantidad.');
    }
  };

  const updateNutritionInfo = (ingredients) => {
    const totalNutrition = ingredients.reduce(
      (acc, ingredient) => {
        acc.calorias += parseFloat(ingredient.calorias);
        acc.carbohidratos += parseFloat(ingredient.carbohidratos);
        acc.proteina += parseFloat(ingredient.proteina);
        acc.grasas += parseFloat(ingredient.grasas);
        return acc;
      },
      { calorias: 0, carbohidratos: 0, proteina: 0, grasas: 0 }
    );
    setNutritionInfo(totalNutrition);
  };

  const handleRemoveIngredient = (ingredient) => {
    const updatedSelectedIngredients = selectedIngredients.filter(item => item.id !== ingredient.id);
    setSelectedIngredients(updatedSelectedIngredients);
    onIngredientsChange(updatedSelectedIngredients);
    updateNutritionInfo(updatedSelectedIngredients);
  };

  const handleSubmit = async () => {
    try {
      const recetaData = {
        // Incluye los datos de la receta aquí, como el título, descripción, etc.
      };
  
      const { data } = await axios.post('http://localhost:3000/api/recetas', recetaData);
      const nuevaRecetaId = data.id; // Obtén el ID de la receta creada
  
      for (const ingredient of selectedIngredients) {
        const ingredientData = {
          idreceta: nuevaRecetaId,
          idingrediente: ingredient.id,
          cant: parseInt(ingredient.quantity, 10) || 0, // Asegúrate de que esto esté correcto
        };
  
        await axios.post('http://localhost:3000/api/ingredientePorReceta', ingredientData);
      }
  
      alert('Receta creada con éxito');
    } catch (error) {
      console.error('Error al crear la receta:', error);
      alert('Error al crear la receta');
    }
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

      <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
        <h3>Opciones:</h3>
        <ul>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li key={option.id}>
                <button type="button" onClick={() => handleAddIngredient(option)}>
                  Agregar {option.nombre}
                </button>
              </li>
            ))
          ) : (
            searchTerm && !loading && <li>No se encontraron ingredientes.</li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Ingredientes Seleccionados:</h3>
        <ul>
          {selectedIngredients.map(ingredient => (
            <li key={ingredient.id}>
              {ingredient.nombre} - {ingredient.quantity}
              <br />
              Calorías: {ingredient.calorias}, Carbohidratos: {ingredient.carbohidratos} g,
              Proteínas: {ingredient.proteina} g, Grasas: {ingredient.grasas} g
              <button type="button" onClick={() => handleRemoveIngredient(ingredient)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <h4>Total Nutricional</h4>
        <p>Calorías: {nutritionInfo.calorias.toFixed(2)}</p>
        <p>Carbohidratos: {nutritionInfo.carbohidratos.toFixed(2)} g</p>
        <p>Proteínas: {nutritionInfo.proteina.toFixed(2)} g</p>
        <p>Grasas: {nutritionInfo.grasas.toFixed(2)} g</p>
      </div>


    </div>
  );
};

IngredientSelector.propTypes = {
  onIngredientsChange: PropTypes.func.isRequired,
};

export default IngredientSelector;
