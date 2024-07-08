import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import BookmarkIcon from '../../img/bookmark.png'; // Asumiendo que esta imagen es estática
import PerfilImagen from '../../img/neo.jpg'; // Asumiendo que esta imagen es estática

const CardRecipe = ({ id, nombre, tiempoMins, calorias, precio,imagenUsuario,nombreusuario,imagen}) => {
  return (
    <div className={styles.card}>
      <img src={imagen} alt={nombre} className={styles.foodImage} width={150} height={150} />

      <h3 className={styles.name}>{nombre}</h3>

      <div className={styles.details}>
        <div className={styles.info}>
          <p className={styles.tiempo}>Tiempo</p>
          <p className={styles.mins}>{tiempoMins}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Calorías</p>
          <p className={styles.mins}>{calorias}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Precio</p>
          <p className={styles.mins}>{precio}</p>
        </div>
      </div>

      <div className={styles.user}>{nombreusuario}</div>
      <img src={imagenUsuario} alt="Perfil" className={styles.userImage} width={40} height={20} />
      <Image src={BookmarkIcon} alt="Bookmark" className={styles.bookmark} width={20} height={20} />
    </div>

  )}

export default CardRecipe;
