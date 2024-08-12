"use client";

import ProfileHeader from '../components/HeaderProfile/Header.js';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode
import imgDefault from '../img/default.jpg';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decodificar el token
        setUserData(decoded);
      } catch (error) {
        console.error('Token inválido', error);
      }
    }
  }, []);

  return (
    <div>
      <ProfileHeader image={imgDefault} name={userData ? userData.name : "Nombre por defecto"} />
    </div>
  );
};

export default ProfilePage;
