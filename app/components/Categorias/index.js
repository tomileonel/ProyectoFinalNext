import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const FoodCategoriesCarousel = ({ onCategorySelect, userId }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0); // Default to "Todas"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recetas/specialTags');
        const fetchedCategories = response.data;

        if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
          const allCategory = { id: 0, nombre: 'Todas' };
          const allCategories = [allCategory, ...fetchedCategories];
          setCategories(allCategories);
        } else {
          console.error('No categories found in the fetched data:', fetchedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch recipes whenever activeCategory changes
    if (userId !== undefined) {
      fetchRecipesByCategory(activeCategory);
    }
  }, [activeCategory, userId]);

  const fetchRecipesByCategory = async (categoryId) => {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/recetas/recipesByTag/${categoryId}/${userId}`);
      const recipes = response.data;
      console.log(`Fetched recipes for category ${categoryId}:`, recipes);
      // Aquí podrías manejar las recetas, por ejemplo, actualizando el estado
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleClick = (category) => {
    if (category.id !== activeCategory) {
      setActiveCategory(category.id);
      onCategorySelect(category.id);
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => handleClick(category)}
          >
            {category.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodCategoriesCarousel;
