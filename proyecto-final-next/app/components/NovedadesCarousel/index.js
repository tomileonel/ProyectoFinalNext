// NovedadesCarousel.js

import React from 'react';
import styles from './styles.module.css';
import CardRecipe from '../CardNovedades/index';
import cesar from '../../img/cesarSalad.png';
import pasta from '../../img/pasta.jpeg';
import sushi from '../../img/sushi.jpg';

const NovedadesCarousel = () => {
  const novedades = [
    { id: 1, name: 'Ensalada César', image: cesar, time: '30 min', calories: '200 kcal', price: '$10', user: 'Usuario 1' },
    { id: 2, name: 'Pasta Carbonara', image: pasta, time: '45 min', calories: '350 kcal', price: '$12', user: 'Usuario 2' },
    { id: 3, name: 'Sushi Variado', image: sushi, time: '60 min', calories: '500 kcal', price: '$15', user: 'Usuario 3' },
  ];

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Novedades</h2>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {novedades.map((novedad) => (
            <CardRecipe
              key={novedad.id}
              name={novedad.name}
              image={novedad.image}
              time={novedad.time}
              calories={novedad.calories}
              price={novedad.price}
              user={novedad.user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NovedadesCarousel;
