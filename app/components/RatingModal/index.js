import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const RatingComponent = ({ idReceta, modalState, closeModal }) => {
  const [rating, setRating] = useState(null); // Calificación actual del usuario
  const [hoveredRating, setHoveredRating] = useState(0); // Para resaltar las estrellas al hacer hover
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [userProfile, setUserProfile] = useState(null); // Perfil del usuario

  useEffect(() => {
    // Función para cargar el perfil del usuario y la calificación
    const fetchUserProfileAndRating = async () => {
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
            
            const ratingResponse = await fetch(`http://localhost:3000/api/recetas/getrating/${idReceta}/${data.id}`);
            if (ratingResponse.ok) {
              const { rating } = await ratingResponse.json();
              setRating(rating); // Establecer el rating actual del usuario
            } else {
              console.error('Error al obtener la calificación del usuario');
            }
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

    if (modalState) {
      fetchUserProfileAndRating(); // Cargar el perfil y la calificación cuando el modal esté abierto
    }
  }, [modalState, idReceta]);

  const handleStarClick = async (clickedRating) => {
    if (userProfile) {
      try {
        const url = `http://localhost:3000/api/recetas/rate/${clickedRating}/${idReceta}/${userProfile.id}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setRating(clickedRating); // Actualizar la calificación localmente
          closeModal(); // Cerrar el modal después de calificar
        } else {
          console.error('Error al enviar la calificación');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };

  return (
    <>
      {modalState && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.tituloModal}>Califica la receta</h2>
            {!loading ? (
              <div className={styles.star}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= (hoveredRating || rating) ? styles.starFilled : styles.starEmpty}`}
                    onClick={() => handleStarClick(star)} // Actualizar la calificación al hacer clic
                    onMouseEnter={() => setHoveredRating(star)} // Resaltar estrellas al hacer hover
                    onMouseLeave={() => setHoveredRating(0)} // Quitar el resaltado al salir del hover
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : (
              <p>Cargando...</p> // Mostrar indicador de carga mientras se obtiene el perfil y rating
            )}
            <button onClick={closeModal} className={styles.botonModal}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingComponent;
