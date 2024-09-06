"use client";

import ProfileHeader from '../components/HeaderProfile/Header.js';
import { useEffect, useState } from 'react';
import * as jwtDecode from 'jwt-decode';
import imgDefault from '../img/default.jpg';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null); // Estado para el perfil del usuario
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

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
            // Decodifica el token para obtener datos adicionales del usuario si es necesario
            const decoded = jwtDecode(token);
            // setUserData(decoded); // Parece que setUserData no está definido en el código proporcionado
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false); // Marca la carga como finalizada
        }
      } else {
        console.error('Token no encontrado');
        setLoading(false); // Marca la carga como finalizada incluso si no hay token
      }
    };

    fetchUserProfile();
  }, []);

  // Puedes mostrar un mensaje de carga o un spinner mientras `loading` es true
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <ProfileHeader
        user={userProfile || { nombre: 'Usuario', imagen: imgDefault }}
      />
    </div>
  );
};

export default ProfilePage;
