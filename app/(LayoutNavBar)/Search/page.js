"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../../components/BarraDeBusqueda';
import CardRecipe from '../../components/CardRecipe';  // Importa el componente CardRecipe
import styles from './styles.module.css';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    maxTime: '',
    calories: '',
  });
  const [recipes, setRecipes] = useState([]); // Inicializar el estado recipes

  // Cargar los valores iniciales desde la URL
  useEffect(() => {
    const initialQuery = searchParams.get('query') || '';
    const initialCategory = searchParams.get('category') || '';
    const initialMaxTime = searchParams.get('maxTime') || '';
    const initialCalories = searchParams.get('calories') || '';

    setSearchQuery(initialQuery);
    setFilters({
      category: initialCategory,
      maxTime: initialMaxTime,
      calories: initialCalories,
    });
  }, [searchParams]);

  // Función para obtener recetas desde la API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log(filters)
        // Construir la URL con los parámetros de búsqueda y filtros
        let url = `http://localhost:3000/api/recetas/recipes?search=${searchQuery}`;
        if (filters.category) url += `&tags=${filters.category}`;
        if (filters.maxTime) url += `&tiempoMax=${filters.maxTime}`;
        if (filters.calories) url += `&caloriasMax=${filters.calories}`;

        const response = await fetch(url);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchQuery, filters]);

  // Actualizar los filtros y la URL
  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);

    // Actualizar la URL con el nuevo query y filtros
    const url = new URL(window.location);
    if (newQuery.trim()) {
      url.searchParams.set('query', newQuery);
    } else {
      url.searchParams.delete('query');
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url);
  };

  return (
    <div className={styles.container}>
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      {/* Aquí agregar los filtros si es necesario */}
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <CardRecipe
            key={recipe.id}
            id={recipe.id}
            nombre={recipe.nombre}
            image={recipe.image}  // Asegúrate de que 'image' exista en el objeto recipe
            prop={recipe.rating}  // Asegúrate de que 'rating' exista en el objeto recipe
            mins={recipe.mins}    // Asegúrate de que 'mins' exista en el objeto recipe
            prop1={recipe.prop1}  // Asegúrate de que 'prop1' exista en el objeto recipe
            kcal={recipe.kcal}    // Asegúrate de que 'kcal' exista en el objeto recipe
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
