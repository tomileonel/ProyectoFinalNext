import styles from "./page.module.css"
import React from 'react';
import FavoritesCarousel from "../components/CarouselFavoritos";

const Favorites = () => {
  const userId = 1;  
  return (
      <div className={styles.main}>
     <p className={styles.title}>Tus favoritos:</p>
     <FavoritesCarousel userId={userId}/>
     </div>

    );
  };
  
  export default Favorites;