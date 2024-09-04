import React from "react";
import Bookmark from ".././BookmarkFavoritos";
import styles from './styles.module.css';

const RecipeHeader = ({ nombre, kcal, minutos, precio, creador ,imagen}) => {
  return (
    <div className={styles.header}>
      <h1>{nombre}</h1>
      <img src={imagen}></img>
      <div className={styles.details}>
        <p>Calorías: {kcal}</p>
        <p>Tiempo: {minutos} mins</p>
        <p>Precio: ${precio}</p>
      </div>
      <div className={styles.creator}>
        <p>Creado por: {creador.nombreusuario}</p>
      </div>
      <Bookmark recetaId={creador.id} /> {/* Suponiendo que el ID de la receta se pasa aquí */}
    </div>
  );
};

export default RecipeHeader;
/*<img src={creador.imagen} alt={creador.nombreusuario} className={styles.creadorFoto} />*/
