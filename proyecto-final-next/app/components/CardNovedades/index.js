// components/CardRecipe.js

import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import BookmarkIcon from '../../img/bookmark.png';

const CardRecipe = ({ name, image, time, calories, price, user }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      <Image src={image} alt={name} width={200} height={150} />
      <div className={styles.details}>
        <p className={styles.info}>Tiempo: {time}</p>
        <p className={styles.info}>Calorías: {calories}</p>
        <p className={styles.info}>Precio: {price}</p>
      </div>
      <div className={styles.user}>{user}</div>
      <Image src={BookmarkIcon} alt="Bookmark" className={styles.bookmark} />
    </div>
  );
};

export default CardRecipe;
