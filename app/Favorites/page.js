"use client"
import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';
import FavoritesCarousel from "../components/CarouselFavoritos";

const Favorites = () => {
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario

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
            setUserId(data.id); // Establece el ID del usuario desde el perfil
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      } else {
        console.error('Token no encontrado');
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className={styles.main}>
      <p className={styles.title}>Tus favoritos:</p>
      {userId !== null ? (
        <FavoritesCarousel userId={userId} /> // Pasa el ID del usuario al componente FavoritesCarousel
      ) : (
        <p>Cargando favoritos...</p>
      )}
    </div>
  );
};

export default Favorites;
