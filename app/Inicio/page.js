'use client';

import React, { useState } from 'react';
import SearchBar from '../components/BarraDeBusqueda';
import FoodCategoriesCarousel from '../components/Categorias';
import HomeRecipesCarousel from '../components/Carousel';
import PopularesCarousel from '../components/PopularesCarousel';
import styles from "./page.module.css"

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userId = 1; // Reemplaza con el ID de usuario dinámico si es necesario

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className={styles.main}>
      <SearchBar />
      <FoodCategoriesCarousel onCategorySelect={handleCategorySelect} />
      <HomeRecipesCarousel selectedCategory={selectedCategory} userId={userId} />
      <PopularesCarousel />
    </div>
  );
};

export default HomePage;

