import React from 'react';
import HomeRecipesCarousel from '../components/Carousel';
import SearchBar from '../components/BarraDeBusqueda';
import FoodCategoriesCarousel from '../components/Categorias';


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
