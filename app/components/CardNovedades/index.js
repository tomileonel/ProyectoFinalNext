import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import Bookmark from '../AgregarFavoritos';
import pocketchef from '../../img/pocketchef.png';

const CardRecipe = ({ id, nombre, tiempoMins, kcal, prop1, imagenUsuario, nombreusuario, image,prop }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userImage = imagenUsuario === 'pocketchef' ? pocketchef : imagenUsuario;
  const imageUrl = image.startsWith('http') ? image : `http://localhost:3000${image}`;
  const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };

  const defaultImageUrl = 'http://localhost:3000/default-image.jpg';  // URL de la imagen por defecto

  const imageUrlUser = imagenUsuario && imagenUsuario.startsWith('http') 
  ? imagenUsuario 
  : `http://localhost:3000${imagenUsuario || "/img/DefaultProfile.jpg"}`;
  return (
    <div className={styles.card}>
      <img 
        src={imageUrl} 
        alt={nombre} 
        className={styles.foodImage} 
        style={imageSize}
      />

      <h3 className={styles.name}>{nombre}     </h3>
      <p className={styles.rating}>{prop}</p>

      <div className={styles.details}>
        <div className={styles.info}>
          <p className={styles.tiempo}>Tiempo</p>
          <p className={styles.mins}>{tiempoMins} Mins</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Calorías</p>
          <p className={styles.mins}>{kcal} kcal</p>
        </div>
        <div className={styles.info}>
          <p className={styles.tiempo}>Precio</p>
          <p className={styles.mins}>{prop1}</p>
        </div>
      </div>

      <div className={styles.user}>{nombreusuario}</div>

      {imagenUsuario === 'pocketchef' ? (
        <Image 
          src={userImage} 
          alt="Perfil" 
          className={styles.userImage} 
          width={40} 
          height={40} 
        />
      ) : (
        <img src={imageUrlUser} alt="Perfil" className={styles.userImage} />
      )}
      
      <Bookmark nombre={nombre} />
    </div>
  );
};

export default CardRecipe;
