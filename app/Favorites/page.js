import styles from "./page.module.css"
import React from 'react';
import FavoritesCarousel from "../components/CarouselFavoritos";

const Favorites = () => {
    return (
      <div className={styles.main}>
     <p className={styles.title}>Tus favoritos:</p>
     <FavoritesCarousel/>
     </div>

    );
  };
  
  export default Favorites;