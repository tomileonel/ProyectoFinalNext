'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CardRecipe from '../CardRecipe';

const HomeRecipesCarousel = ({ selectedCategory, userId }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let url;
        if (selectedCategory == null || selectedCategory === 0) {
          url = `http://localhost:3000/api/recetas/byTag/${userId}`;
        } else {
          url = `http://localhost:3000/api/recetas/recipesByTag/${selectedCategory}/${userId}`;
        }

        const response = await axios.get(url);

        const recipesWithTotalTime = response.data.map(recipe => {
          const totalTime = recipe.tiempoMins || // Prioritize `tiempoMins` from backend if available
            recipe.pasos?.reduce((acc, paso) => acc + (paso.duracionMin || 0), 0) || 0;
          return { ...recipe, tiempoTotal: totalTime };
        });

        setRecipes(recipesWithTotalTime);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, [selectedCategory, userId]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {recipes.map((recipe, index) => (
            <CardRecipe
              key={index}
              id={recipe.id}
              nombre={recipe.nombre || 'Recipe Name'}
              image={recipe.imagen || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
              prop={`⭐${recipe.rating || 'Rating'}`}
              tiempoMins={`${recipe.tiempoTotal || 'Tiempo Total Desconocido'} Mins`}
              prop1={`${recipe.precio || 'Price'}$`}
              kcal={`${recipe.calorias || 'Calories'} Kcal`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeRecipesCarousel;
