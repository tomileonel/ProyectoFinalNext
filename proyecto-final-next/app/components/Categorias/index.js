'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';

const FoodCategoriesCarousel = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = ['Todo', 'India', 'Italiana', 'Asiatica', 'China'];

  const handleClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => handleClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodCategoriesCarousel;
