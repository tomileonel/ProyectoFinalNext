import React from 'react';
import SearchBar from './components/BarraDeBusqueda';
import FoodCategoriesCarousel from './components/Categorias';
import HomeRecipesCarousel from './components/Carousel';
import NovedadesCarousel from './components/NovedadesCarousel';

const HomePage = () => {
  return (
    <div>
      <SearchBar />
      <FoodCategoriesCarousel />
      <HomeRecipesCarousel />
      <NovedadesCarousel />
    </div>
  );
};

export default HomePage;