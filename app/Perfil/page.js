 "use client"; 
import { useRouter } from 'next/navigation'; // Usa next/navigation en lugar de next/router
import { useEffect, useState } from 'react';
import ProfileHeader from '../components/HeaderProfile/Header.js';
import imgDefault from '../img/default.jpg';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

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

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleAddRecipeClick = () => {
    router.push('/CrearReceta'); // Redirigir a la página para agregar receta
  };

  return (
    <div>
      <ProfileHeader user={userProfile || { nombre: 'Usuario', imagen: imgDefault }} />
      <button onClick={handleAddRecipeClick}>Agregar nueva receta</button>
    </div>
  );
};

export default ProfilePage;
