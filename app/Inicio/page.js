import React from 'react';
import SearchBar from './components/BarraDeBusqueda';
import FoodCategoriesCarousel from './components/Categorias';
import HomeRecipesCarousel from './components/Carousel';
import NovedadesCarousel from './components/NovedadesCarousel';
import styles from "./page.module.css"
const HomePage = () => {
  return (
    <div className={styles.main}>
      <SearchBar />
      <FoodCategoriesCarousel />
      <HomeRecipesCarousel />
      <NovedadesCarousel />
    </div>
  );
};

export default HomePage;