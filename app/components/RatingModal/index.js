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
            const ratingData = await ratingResponse.json();
            if (ratingResponse.ok) {
              setRating(ratingData.recordset[0]?.rating || null); // Establecer el rating actual del usuario
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
        let url;
        let method;
  
        // Verificar si hay una calificación existente para decidir el método HTTP
        if (rating !== null) {
          url = `http://localhost:3000/api/recetas/updaterating/${clickedRating}/${idReceta}/${userProfile.id}`;
          method = 'PUT';
        } else {
          url = `http://localhost:3000/api/recetas/rate/${clickedRating}/${idReceta}/${userProfile.id}`;
          method = 'POST';
        }
        
        // Hacer la primera solicitud PUT o POST
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Si PUT o POST es exitoso, hacer la solicitud 
          console.log(idReceta)
          const patchUrl = `http://localhost:3000/api/recetas/ratingreceta/${idReceta}`;
          const patchResponse = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (patchResponse.ok) {
            setRating(clickedRating); // Actualizar la calificación localmente
            closeModal(); // Cerrar el modal después de calificar
          } else {
            const errorDetails = await patchResponse.text();
            console.error('Error al hacer el PATCH:', errorDetails);
          }
        } else {
          const errorDetails = await response.text();
          console.error('Error al hacer el PUT o POST:', errorDetails);
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
