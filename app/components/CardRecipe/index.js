import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import Bookmark from '../AgregarFavoritos';

const CardRecipe = ({ id, nombre, image, prop, tiempoMins, prop1, kcal }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter();
  const imageUrl = image ? `http://localhost:3000${image}` : '/path/to/default-image.jpg';
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verificamos que 'tiempoMins' sea un número válido. Si no lo es, lo ponemos a 0.
  const minutes = typeof tiempoMins === 'number' && !isNaN(tiempoMins) ? tiempoMins : 0;

  const handleCardClick = () => {
    router.push(`/Recetas/${id}`);
  };

  
  const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };

  return (
    <div className={styles.card}>
      <div onClick={handleCardClick}>
        <div className={styles.foodPhoto}>
          <img 
            src={imageUrl} 
            alt={nombre} 
            className={styles.image} 
            style={imageSize} 
          />
          <div className={styles.titleButton}>
            <p className={styles.nombre}>{nombre}</p>
          </div>
        </div>

        <div className={styles.rating}>
          <p className={styles.text}>{prop}</p>
        </div>

        <div className={styles.time}>
          <div className={styles.time1}>
            <p className={styles.tiempo}>Tiempo Total</p>
            {/* Usamos 'minutes' en lugar de 'tiempoMins' y mostramos "Tiempo Desconocido" si 'minutes' es 0 */}
            <p className={styles.mins}>{minutes > 0 ? `${minutes} Mins` : 'Tiempo Desconocido'}</p>
          </div>
          <div className={styles.time2}>
            <p className={styles.tiempo}>Precio</p>
            <p className={styles.mins}>{prop1}</p>
          </div>
          <div className={styles.time3}>
            <p className={styles.tiempo}>Calorías</p>
            <p className={styles.mins}>{kcal}</p>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Bookmark nombre={nombre} />
      </div>
    </div>
  );
};

export default CardRecipe;
