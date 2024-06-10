import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import bookmark from '../../img/bookmark.png';

const CardRecipe = ({ ensaladaCsar, image, prop, mins, prop1, kcal }) => {
  return (
    <div className={styles.card}>
      <div className={styles.foodPhoto}>
        <Image className={styles.image} src={image} alt={ensaladaCsar} width={150} height={100} />
        <Image className={styles.bookmarkIcon} src={bookmark} alt="bookmark" width={20} height={20} />
        <div className={styles.titleButton}>
          <p className={styles.ensaladaCsar}>{ensaladaCsar}</p>
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
      </div>
    </div>
  );
};

export default CardRecipe;
