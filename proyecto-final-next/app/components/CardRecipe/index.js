import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import bookmark from '../../img/bookmark.png';

const CardRecipe = ({ nombre, image, prop, mins, prop1, kcal }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };

  return (
    <div className={styles.card}>
      <div className={styles.foodPhoto}>
        <img 
          src={image} 
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
          <p className={styles.tiempo}>Tiempo</p>
          <p className={styles.mins}>{mins}</p>
        </div>
        <div className={styles.time2}>
          <p className={styles.tiempo}>Precio</p>
          <p className={styles.mins}>{prop1}</p>
        </div>
        <div className={styles.time3}>
          <p className={styles.tiempo}>Calorías</p>
          <p className={styles.mins}>{kcal}</p>
        </div>
        <Image className={styles.bookmarkIcon} src={bookmark} alt="bookmark" width={20} height={20} />
      </div>
    </div>
  );
};

export default CardRecipe;
