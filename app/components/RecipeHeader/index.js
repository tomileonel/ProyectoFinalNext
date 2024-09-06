import React from "react";
import Bookmark from "../BookmarkFavoritos";
import styles from './styles.module.css';

const RecipeHeader = ({ nombre, kcal, minutos, precio, creador, imagen, rating }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{nombre}</h1>
      <div className={styles.recipeImageContainer}>
        <img 
          src={imagen} 
          alt={`Imagen de ${nombre}`} 
          className={styles.recipeImage}
        />
        <div className={styles.details}>
          <p>Calorías: {kcal}</p>
          <p>Tiempo: {minutos} mins</p>
          <p>Precio: ${precio}</p>
          <p>🌟 {rating}</p>
          <Bookmark recetaId={creador.id} /> 
        </div>
      </div>
      <div className={styles.creator}>
        <img src={creador.imagen} alt={creador.nombreusuario} className={styles.creadorFoto} />
        <p>Creado por: {creador.nombreusuario}</p>
      </div>
      
    </div>
  );
};

export default RecipeHeader;
