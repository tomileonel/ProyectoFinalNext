'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CardRecipe from '../CardRecipe';

const HomeRecipesCarousel = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recetas/byTag/1');
        setRecipes(response.data);  
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {recipes.map((recipe, index) => (
            <CardRecipe
              key={index}
              ensaladaCsar={recipe.nombre || 'Recipe Name'}
              // image={recipe.imagen || 'https://example.com/images/default_image.png'}
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
