'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/BarraDeBusqueda';
import FoodCategoriesCarousel from '../components/Categorias';
import HomeRecipesCarousel from '../components/Carousel';
import PopularesCarousel from '../components/PopularesCarousel';
import styles from "./page.module.css";
import jwt from 'jsonwebtoken';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userId, setUserId] = useState(1); // Usuario por defecto

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUserId(decoded?.id || 1); // Utiliza el ID del token o el usuario por defecto
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

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
  