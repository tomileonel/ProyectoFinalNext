"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CardFavorite from '../CardFavorites';

const FavoritesCarousel = ({ userId }) => {
  const [favorite, setFavorite] = useState([]);

  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/favoritos/favoritesFromUser/${userId}`);

        if (Array.isArray(response.data.recordset)) {
          setFavorite(response.data.recordset);
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          setFavorite([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setFavorite([]);
      }
    };
    fetchRecipes();
  }, [userId]);

  const handleFavoriteChange = (favoritoId) => {
    // Filtra los favoritos para eliminar el que se desmarcó
    setFavorite(prevFavorites => prevFavorites.filter(favorito => favorito.id !== favoritoId));
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {favorite.map((favoritos, index) => {
            // Verificamos si la imagen existe, si no, usamos la imagen predeterminada.
            const imageUrl = favoritos.imagen 
              ? `http://localhost:3000${favoritos.imagen}` 
              : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
  
            return (
              <div key={index} className={styles.cardContainer}>
                <CardFavorite
                  nombre={favoritos.nombre || 'Recipe Name'}
                  image={imageUrl}  // Asignamos la URL de la imagen (o la predeterminada)
                  prop={`⭐${favoritos.rating || 'Rating'}`}
                  mins={`${favoritos.tiempoMins || 'Time'} Mins`}
                  prop1={`${favoritos.precio || 'Price'}$`}
                  kcal={`${favoritos.calorias || 'Calories'} Kcal`}
                  onFavoriteChange={() => handleFavoriteChange(favoritos.id)} // Escucha cuando se cambia el estado del favorito
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
        };  
export default FavoritesCarousel;
