// components/CardNovedades/index.js

import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import BookmarkIcon from '../../img/bookmark.png';
import PerfilImagen from '../../img/neo.jpg'

const CardRecipe = ({ name, image, time, calories, price, user, userImage }) => {
  return (
    <div className={styles.card}>
      <Image src={image} alt={name} className={styles.foodImage} width={150} height={150} />
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.details}>
        <div className={styles.info}>
          <p className={styles.tiempo}>Tiempo</p>
          <p className={styles.mins}>{time}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Calorías</p>
          <p className={styles.mins}>{calories}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Precio</p>
          <p className={styles.mins}>{price}</p>
        </div>
      </div>
      <div className={styles.user}>{user}</div>
      <Image src={PerfilImagen} alt="ImageUser" className={styles.userImage} width={20} height={20} />
      <Image src={BookmarkIcon} alt="Bookmark" className={styles.bookmark} width={20} height={20} />
    </div>
  );
};

export default CardRecipe;
