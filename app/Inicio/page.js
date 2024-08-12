'use client';

import React, { useState } from 'react';
import SearchBar from '../components/BarraDeBusqueda';
import FoodCategoriesCarousel from '../components/Categorias';
import HomeRecipesCarousel from '../components/Carousel';
import NovedadesCarousel from '../components/NovedadesCarousel';
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
      <NovedadesCarousel />
    </div>
  );
};

export default HomePage;

