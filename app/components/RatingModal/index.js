import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const RatingComponent = ({ idReceta, modalState }) => {
  const [isModalOpen, setIsModalOpen] = useState(modalState);
  const [rating, setRating] = useState(null); // Mantendrá la calificación actual del usuario
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Indicador de carga

  // Fetch del perfil de usuario y última calificación
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

            // Obtener la última calificación del usuario para esta receta
            const ratingResponse = await fetch(`http://localhost:3000/api/getrating/${idReceta}/${data.id}`);
            if (ratingResponse.ok) {
              const { rating } = await ratingResponse.json();
              setRating(rating); // Establece la última calificación del usuario
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
    fetchUserProfile();
  }, [idReceta]);

  const closeModal = () => setIsModalOpen(false);

  const handleStarClick = async (clickedRating) => {
    if (userProfile) {
      try {
        // Si ya hay una calificación, actualizamos
        const url = rating
          ? `http://localhost:3000/api/updaterating/rate/${clickedRating}/${idReceta}/${userProfile.id}`
          : `http://localhost:3000/api/recetas/rate/${clickedRating}/${idReceta}/${userProfile.id}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setRating(clickedRating); // Actualizamos la calificación localmente
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
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.tituloModal}>Califica la receta</h2>
            {!loading ? (
              <div className={styles.star}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${star <= (hoveredRating || rating) ? styles.starFilled : styles.starEmpty}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : (
              <p>Cargando...</p> // Mostrar indicador de carga
            )}
            <button onClick={closeModal} className={styles.botonModal}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingComponent;
