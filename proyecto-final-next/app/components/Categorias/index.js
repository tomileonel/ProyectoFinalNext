import React from 'react';
import styles from './styles.module.css';

const FoodCategoriesCarousel = () => {
  const categories = ['Todo', 'India', 'Italiana', 'Asiatica', 'China'];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {categories.map((category, index) => (
          <button key={index} className={styles.categoryButton}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodCategoriesCarousel;
