"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/BarraDeBusqueda';
import CardRecipe from '../components/CardRecipe';  // Importa el componente CardRecipe
import styles from './styles.module.css';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]); // Inicializar el estado recipes

  useEffect(() => {
    // Obtén el query de la URL
    const initialQuery = searchParams.get('query') || '';
    setSearchQuery(initialQuery);   
  }, [searchParams]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Modifica la URL de la solicitud dependiendo del valor de searchQuery
        const url = searchQuery ? 
          `http://localhost:3000/api/recetas/recipes?search=${searchQuery}` :
          'http://localhost:3000/api/recetas/recipes'; // Traer todas las recetas si searchQuery está vacío
        const response = await fetch(url);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
    // Actualiza la URL para reflejar el nuevo query
    const url = new URL(window.location);
    if (newQuery.trim()) {
      url.searchParams.set('query', newQuery);
    } else {
      url.searchParams.delete('query');
    }
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
