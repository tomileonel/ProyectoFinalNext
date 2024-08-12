"use client";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import CardRecipe from '../CardRecipe';

const FavoritesCarousel = () => {
    const [favorite, setFavorite] = useState([])
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(``)
            } catch (error) {
                
            }
        }
    })
    return (
        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            <div className={styles.cards}>
              {isFavorite.map((isFavorite, index) => (
                <CardRecipe
                  key={index}
                  nombre={isFavorite.nombre || 'Recipe Name'}
                  image={isFavorite.imagen || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                  prop={`⭐${isFavorite.rating || 'Rating'}`}
                  mins={`${isFavorite.tiempoMins || 'Time'} Mins`}
                  prop1={`${isFavorite.precio || 'Price'}$`}
                  kcal={`${isFavorite.calorias || 'Calories'} Kcal`}
                />
              ))}
            </div>
          </div>
        </div>
      );
}
export default FavoritesCarousel