"use client"
import React, {useState,useEffect} from 'react';
import styles from './page.module.css'
import CarritoCard from '@/app/components/CarritoCard';
import axios from 'axios';

export default function Carrito() {
  const [userId, setUserId] = useState(null);
  const [recetas, setRecetas] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/getUserProfile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
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

  useEffect(() => {
    const fetchRecetasCarrito = async () => {
      if (userId) { // Asegurarse de que userId esté disponible
        try {
          const response = await axios.get(`http://localhost:3000/api/carrito/getInfoCarrito/${userId}`);
          setRecetas(response.data); // Guardar los datos de la respuesta
        } catch (error) {
          console.error("Hubo un error consiguiendo las recetas: ", error);
        }
      }
    };
    fetchRecetasCarrito();
  }, [userId])
  console.log(recetas)
  return ( 
     <div className={styles.container}>
     <p className={styles.title}>Cesta</p> 
       {recetas && recetas.map((receta, index) => (
        <CarritoCard
          key={index}
          imagen={receta.imagen}
          nombre={receta.nombre}
          kcal={receta.calorias}
          minutos={receta.tiempoMins}
          precio={receta.precio}
          id={receta.id}
        />
      ))}
      </div>
    );
  }

