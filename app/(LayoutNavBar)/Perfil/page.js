  "use client";
  import { useRouter } from 'next/navigation';
  import { useEffect, useState, useRef } from 'react';
  import Image from 'next/image';
  import img from '../../img/pfp.png';
  import styles from './page.module.css'; // Archivo CSS
  import Calendar from 'react-calendar';
  import 'react-calendar/dist/Calendar.css';
  import axios from 'axios';

  const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedTab, setSelectedTab] = useState('recetas');
    const [userProfile, setUserProfile] = useState(null);
    const [recetas, setRecetas] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();
    const [eventos, setEventos] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

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
          console.log('Eventos:', response.data);
          setEventos(response.data);
        } catch (error) {
          console.error('Error al obtener eventos', error);
        }
      };

      fetchEventos();
    }, []);

    const eventosPorFecha = eventos
      .filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return (
          fechaEvento.getFullYear() === fechaSeleccionada.getFullYear() &&
          fechaEvento.getMonth() === fechaSeleccionada.getMonth() &&
          fechaEvento.getDate() === fechaSeleccionada.getDate()
        );
      })
      .sort((a, b) => a.horaInicio - b.horaInicio);

    useEffect(() => {
      const fetchRecetas = async () => {
        if (userProfile?.id) {
          try {
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
          
          <div className={styles.menuContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={styles.menuButton}>
              ⋮
            </button>
            {showMenu && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => router.push('/Config')} className={styles.menuItem}>Config</button>
                <button onClick={() => router.push('/EditarPerfil')} className={styles.menuItem}>Editar Perfil</button>
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
                            🖉
                          </button>
                          <button onClick={() => handleDeleteRecipe(receta.id)} className={styles.deleteButton}>
                            🗑️
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
              <div className={styles.customCalendar}>
                <Calendar
                  onChange={setFechaSeleccionada}
                  value={fechaSeleccionada}
                  className={styles.calendar}
                />
              </div>
              <h2 className={styles.eventHeader}>Eventos en {fechaSeleccionada.toDateString()}</h2>
              <div className={styles.eventList}>
                <ul>
                  {eventosPorFecha.length > 0 ? (
                    eventosPorFecha.map(evento => {
                      const duracion = evento.horaInicio === 0 && evento.horaFinal === 24
                        ? 'Todo el día'
                        : `${evento.horaInicio} - ${evento.horaFinal}`;
                      return (
                        <li key={evento.id} className={styles.eventItem}>
                          <span className={styles.eventTitle}>{evento.titulo}</span> <br />
                          <span className={styles.eventDuration}>{duracion}</span> 
                        </li>
                      );
                    })
                  ) : (
                    <p>No tienes eventos programados para esta fecha.</p>
                  )}
                </ul>
              </div>
            </div>
          }
        </div>
      </div>
    );
  };

  export default ProfilePage;
