import React from 'react';
import SearchBar from './components/BarraDeBusqueda';
import FoodCategoriesCarousel from './components/Categorias';
import HomeRecipesCarousel from './components/Carousel';

const HomePage = () => {
  return (
    <div>
      <SearchBar />
      <FoodCategoriesCarousel />
      <HomeRecipesCarousel />
    </div>
  );
};

export default HomePage;