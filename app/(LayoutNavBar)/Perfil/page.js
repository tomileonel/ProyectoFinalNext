
"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import img from '../../img/pfp.png';
import styles from './page.module.css'; // Archivo CSS
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recetas');
  const [userProfile, setUserProfile] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar el menú
  const menuRef = useRef(null); // Referencia al menú
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
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


  
    useEffect(() => {
      const fetchEventos = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/eventos');
          setEventos(response.data);
        } catch (error) {
          console.error('Error al obtener eventos', error);
        }
      };
  
      fetchEventos();
    }, []);
  
    const eventosPorFecha = eventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return (
        fechaEvento.getFullYear() === fechaSeleccionada.getFullYear() &&  
        fechaEvento.getMonth() === fechaSeleccionada.getMonth() &&
        fechaEvento.getDate() === fechaSeleccionada.getDate()
      );
    });
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
          <div>
<div className={styles.recetasContainer}>
  {recetas.length > 0 ? (
    <div className={styles.recetasScroll}>
      {recetas.map((receta) => (
        <div key={receta.id} className={styles.recetaCard}>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonBackground}></div>
            <button onClick={() => handleEditRecipe(receta.id)} className={styles.editButton}>
              🖉 {/* Icono de edición */}
            </button>
            <button onClick={() => handleDeleteRecipe(receta.id)} className={styles.deleteButton}>
              🗑️ {/* Icono de eliminación */}
            </button>
          </div>
          <img src={receta.imagen} alt={receta.titulo} className={styles.recetaImagen} />
          <h3 onClick={() => router.push(`/Recetas/${receta.id}`)} className={styles.recetaTitulo}>
            {receta.nombre}
          </h3>
          <p>{receta.descripcion.length > 100 ? `${receta.descripcion.slice(0, 100)}...` : receta.descripcion}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No tienes recetas disponibles.</p>
  )}
</div>
            <button onClick={handleAddRecipeClick} className={styles.addButton}>
              Agregar nueva receta
            </button>
          </div>
        )}
        {selectedTab === 'notificaciones' && <div>Contenido de Notificaciones</div>}
        {selectedTab === 'eventos' && 
     <div className={styles.container}>
     <div className={styles.calendar}>
       <Calendar
         onChange={setFechaSeleccionada}
         value={fechaSeleccionada}
       />
     </div>
     <h2>Eventos en {fechaSeleccionada.toDateString()}</h2>
     <div className={styles.eventList}>
       <ul>
         {eventosPorFecha.length > 0 ? (
           eventosPorFecha.map(evento => (
             <li key={evento._id}>
               <h3>{evento.titulo}</h3>
               <p>{evento.descripcion}</p>
               <p>Fecha: {new Date(evento.fecha).toLocaleString()}</p>
               <p>Duración: {evento.duracionHrs} horas</p>
             </li>
           ))
         ) : (
           <p>No hay eventos para esta fecha.</p>
         )}
       </ul>
     </div>
   </div>
        }
      </div>
    </div>
  );
            }  
          
export default ProfilePage;
