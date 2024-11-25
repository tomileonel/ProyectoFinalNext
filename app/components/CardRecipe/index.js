import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import Bookmark from '../AgregarFavoritos';

const CardRecipe = ({ id, nombre, image, prop, tiempoMins, prop1, kcal }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter();
  const imageUrl = image.startsWith('http') ? image : `http://localhost:3000${image}`;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = () => {
    router.push(`/Recetas/${id}`);
  };

  const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };

  return (
    <div className={styles.card}>
      <div onClick={handleCardClick}>
        <img src={imageUrl} alt={nombre} className={styles.image} style={imageSize} />
        <h3 className={styles.nombre}>{nombre}</h3>
        <div className={styles.details}>
          <p className={styles.tiempo}>Tiempo: {tiempoMins}</p>
          <p className={styles.rating}>{prop}</p>
          <p className={styles.kcal}>Calorías: {kcal}</p>
          <p className={styles.precio}>Precio:{prop1}</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <Bookmark nombre={nombre} />
      </div>
    </div>
  );
};

export default CardRecipe;
