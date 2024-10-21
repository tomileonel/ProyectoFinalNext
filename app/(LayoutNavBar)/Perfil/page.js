"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import img from '../../img/pfp.png';
import styles from './page.module.css'; // Archivo CSS

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recetas');
  const [userProfile, setUserProfile] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar el menú
  const menuRef = useRef(null); // Referencia al menú
  const router = useRouter();

  // Fetch user profile
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

  // Fetch user recipes
  useEffect(() => {
    const fetchRecetas = async () => {
      if (userProfile?.id) {
        try {
          console.log(userProfile.id);
          const response = await fetch(`http://localhost:3000/api/recetas/byUser/${userProfile.id}`);
          if (response.ok) {
            const data = await response.json();
            setRecetas(data);
          } else {
            console.error('Error al obtener recetas');
          }
        } catch (error) {
          console.error('Error en la solicitud de recetas:', error);
        }
      }
    };

    if (selectedTab === 'recetas') {
      fetchRecetas();
    }
  }, [userProfile, selectedTab]);

  // Cerrar menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleAddRecipeClick = () => {
    router.push('/CrearReceta');
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <Image
          src={userProfile?.imagen || img}
          alt={userProfile?.nombre || 'Usuario'}
          className={styles.profileImage}
          width={150}
          height={150}
        />
        <h2 className={styles.userName}>{userProfile?.nombre || 'Usuario'}</h2>
        
        {/* Botón para mostrar el menú de opciones */}
        <div className={styles.menuContainer} ref={menuRef}>
          <button onClick={toggleMenu} className={styles.menuButton}>
            ⋮
          </button>
          {showMenu && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => router.push('/config')} className={styles.menuItem}>Config</button>
              <button onClick={() => router.push('/editarPerfil')} className={styles.menuItem}>Editar Perfil</button>
              <button onClick={handleLogout} className={styles.menuItem}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.description}>
        {userProfile?.descripcion ? (
          <>
            <p>
              {showFullDescription 
                ? userProfile.descripcion 
                : `${userProfile.descripcion.slice(0, 100)}...`}
            </p>
            {userProfile.descripcion.length > 100 && (
              <button onClick={toggleDescription} className={styles.moreButton}>
                {showFullDescription ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </>
        ) : (
          <p className={styles.incentiveText}>
            Aún no tienes una descripción. ¡Crea una para personalizar tu perfil!
          </p>
        )}
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${selectedTab === 'recetas' ? styles.activeTab : ''}`} 
          onClick={() => handleTabClick('recetas')}
        >
          Recetas
        </button>
        <button 
          className={`${styles.tabButton} ${selectedTab === 'notificaciones' ? styles.activeTab : ''}`} 
          onClick={() => handleTabClick('notificaciones')}
        >
          Notificaciones
        </button>
        <button 
          className={`${styles.tabButton} ${selectedTab === 'eventos' ? styles.activeTab : ''}`} 
          onClick={() => handleTabClick('eventos')}
        >
          Eventos
        </button>
      </div>

      <div className={styles.tabContent}>
        {selectedTab === 'recetas' && (
          <div className={styles.recetasContainer}>
            {recetas.length > 0 ? (
              recetas.map((receta) => (
                <div key={receta.id} className={styles.recetaCard}>
                  <h3>{receta.titulo}</h3>
                  <p>{receta.descripcion.slice(0, 100)}...</p>
                  {/* Puedes agregar más campos según los datos disponibles */}
                </div>
              ))
            ) : (
              <p>No tienes recetas disponibles.</p>
            )}
          </div>
        )}
        {selectedTab === 'notificaciones' && <div>Contenido de Notificaciones</div>}
        {selectedTab === 'eventos' && <div>Contenido de Eventos</div>}
      </div>

      <button onClick={handleAddRecipeClick} className={styles.addButton}>
        Agregar nueva receta
      </button>
    </div>
  );
};

export default ProfilePage;
