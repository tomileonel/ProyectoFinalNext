"use client";

import ProfileHeader from '../components/HeaderProfile/Header.js';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode
import imgDefault from '../img/default.jpg';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null); // Estado para el perfil del usuario

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
            setUserData(decoded);
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


  return (
    <div>
      <ProfileHeader
      user={userProfile||1}
      />
    </div>
  );
};

export default ProfilePage;
