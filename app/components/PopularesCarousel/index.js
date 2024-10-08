'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CardRecipe from '../CardNovedades';

const PopularesCarousel = () => {
  const [populares, setPopulares] = useState([]);

  useEffect(() => {
    const fetchPopulares = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recetas/novedades/1'); 
        setPopulares(response.data); 
      } catch (error) {
        console.error('Error fetching novedades:', error);
      }
    };

    fetchPopulares();
  }, []); 

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Mas populares</h2>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {populares.map((novedad) => ( 
            <CardRecipe
              key={novedad.id}
              nombre={novedad.nombre || 'Nombre de la Receta'}
              imagen={novedad.imagen || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
              tiempoMins={`${novedad.tiempoMins || 'Tiempo Desconocido'} Mins`}
              calorias={`${novedad.calorias || 'Calorías Desconocidas'} Kcal`}
              precio={novedad.precio ? `${novedad.precio}$` : 'Precio Desconocido'}
              imagenUsuario={novedad.imagenUsuario || 'https://example.com/default-user-image.jpg'}
              nombreusuario={novedad.nombreusuario || 'Usuario Desconocido'}
            />
          ))}             
        </div>
      </div>
    </div>
  );
};
export default PopularesCarousel;
