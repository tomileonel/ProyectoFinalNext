import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import BookmarkIcon from '../../img/bookmark.png'; // Asumiendo que esta imagen es estática
import pocketchef from '../../img/pocketchef.png'; // Asumiendo que esta imagen es estática

const CardRecipe = ({ id, nombre, tiempoMins, calorias, precio, imagenUsuario, nombreusuario, imagen }) => {
  // Determina la imagen de usuario a utilizar
  const userImage = imagenUsuario === 'pocketchef' ? pocketchef : imagenUsuario;

  return (
    <div className={styles.card}>
      <img src={imagen} alt={nombre} className={styles.foodImage} />

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

      {/* Renderización condicional de la imagen de usuario */}
      {imagenUsuario === 'pocketchef' ? (
        <Image src={userImage} alt="Perfil" className={styles.userImage} />
      ) : (
        <img src={userImage} alt="Perfil" className={styles.userImage} />
      )}

      <Image src={BookmarkIcon} alt="Bookmark" className={styles.bookmark} />
    </div>
  );
};

export default CardRecipe;
