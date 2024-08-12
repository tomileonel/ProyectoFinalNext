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
          // Special case for category "Todas" or if selectedCategory is null/undefined
          url = `http://localhost:3000/api/recetas/byTag/${userId}`;
        } else {
          url = `http://localhost:3000/api/recetas/recipesByTag/${selectedCategory}/${userId}`;
        }

        const response = await axios.get(url);
        setRecipes(response.data);
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
              nombre={recipe.nombre || 'Recipe Name'}
              image={recipe.imagen || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
              prop={`⭐${recipe.rating || 'Rating'}`}
              mins={`${recipe.tiempoMins || 'Time'} Mins`}
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
