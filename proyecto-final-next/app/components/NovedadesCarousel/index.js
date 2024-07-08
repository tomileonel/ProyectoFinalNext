'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CardRecipe from '../CardNovedades';

const NovedadesCarousel = () => {
  const [novedades, setNovedades] = useState([]);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recetas/novedades/1'); 
        setNovedades(response.data); 
      } catch (error) {
        console.error('Error fetching novedades:', error);
      }
    };

    fetchNovedades();
  }, []); 

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Novedades</h2>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {novedades.map((novedad) => (
            <CardRecipe
              key={novedad.id}
              nombre={novedad.nombre}
              imagen={novedad.imagen}
              tiempoMins={novedad.tiempoMins}
              calorias={novedad.calorias}
              precio={novedad.precio}
              imagenUsuario={novedad.imagenUsuario}
              nombreusuario={novedad.nombreusuario}

            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NovedadesCarousel;
