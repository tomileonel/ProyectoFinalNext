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
    tags: [], // Agregar tags al estado de filtros
  });
  const [recipes, setRecipes] = useState([]); // Inicializar el estado recipes

  // Cargar los valores iniciales desde la URL
  useEffect(() => {
    const initialQuery = searchParams.get('query') || '';
    const initialCategory = searchParams.get('category') || '';
    const initialMaxTime = searchParams.get('maxTime') || '';
    const initialCalories = searchParams.get('calories') || '';
    const initialTags = searchParams.get('tags') ? searchParams.get('tags').split(',') : []; // Obtener tags

    setSearchQuery(initialQuery);
    setFilters({
      category: initialCategory,
      maxTime: initialMaxTime,
      calories: initialCalories,
      tags: initialTags, // Asignar tags al estado
    });
  }, [searchParams]);

  // Función para obtener recetas desde la API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log(filters);
        // Construir la URL con los parámetros de búsqueda y filtros
        let url = `http://localhost:3000/api/recetas/recipes?search=${searchQuery}`;
        if (filters.tags.length > 0) url += `&tags=${filters.tags.join(',')}`; // Agregar tags
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
      if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(',')); // Manejar el caso de los tags
      } else if (value) {
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
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <CardRecipe
            key={recipe.id}
            id={recipe.id}
            nombre={recipe.nombre}
            image={recipe.imagen}
            prop={recipe.rating}
            mins={recipe.tiempoMins}
            prop1={recipe.precio}
            kcal={recipe.calorias}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
