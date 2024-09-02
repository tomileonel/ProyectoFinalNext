'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/BarraDeBusqueda';
import FoodCategoriesCarousel from '../components/Categorias';
import HomeRecipesCarousel from '../components/Carousel';
import PopularesCarousel from '../components/PopularesCarousel';
import styles from "./page.module.css";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage

      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/getUserProfile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Agrega el token en el encabezado Authorization
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Token no encontrado');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className={styles.main}>
      <SearchBar />
      <FoodCategoriesCarousel onCategorySelect={handleCategorySelect} />
      <HomeRecipesCarousel selectedCategory={selectedCategory} userId={userProfile?.id || 1} />
      <PopularesCarousel />
      <h1>{userProfile?.nombreusuario || 'No registrado'}</h1>
    </div>
  );
};

export default HomePage;
