// index.js
import React, { useState, useEffect, useRef } from "react";
import Bookmark from "../BookmarkFavoritos";
import styles from './styles.module.css';

const DropdownMenu = ({ isOpen, onClose, openShareModal, openRatingModal }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownItem} onClick={openShareModal}>
        <span>↗</span> Compartir
      </div>
      <div className={styles.dropdownItem} onClick={openRatingModal}>
        <span>★</span> Calificar
      </div>
      <div className={styles.dropdownItem}>
        <span>💬</span> Comentar
      </div>
    </div>
  );
};

const ShareModal = ({ onClose }) => {
  const url = window.location.href;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.textoModal}>Compartir receta</h2>
        <p className={styles.descripcionModal}>
          Copie el enlace de la receta y comparta el enlace de su receta con amigos y familiares.
        </p>
        <input className={styles.enlaceModal} type="text" value={url} readOnly />
        <div className={styles.modalActions}>
          <button className={styles.botonModal} onClick={onClose}>Cerrar</button>
          <button className={styles.botonModal} onClick={() => navigator.clipboard.writeText(url)}>Copiar enlace</button>
        </div>
      </div>
    </div>
  );
};

const RatingModal = ({ onClose, onRate, currentRating }) => {
  const [rating, setRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
    onRate(clickedRating);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.textoModal}>Califica la receta</h2>
        <div className={styles.starRating}>
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
        <button className={styles.botonModal} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

const RecipeHeader = ({ nombre, kcal, minutos, precio, creador, imagen, rating: initialRating, id }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);

  // Retrieve the stored rating from localStorage
  useEffect(() => {
    const savedRating = localStorage.getItem(`recipe_${id}_rating`);
    if (savedRating) {
      setRating(parseInt(savedRating, 10));
    }
  }, [id]);

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
        }
      } else {
        console.error('Token no encontrado');
      }
    };

    fetchUserProfile();
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
    setIsDropdownOpen(false);
  };

  const openRatingModal = () => {
    setIsRatingModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleRate = async (newRating) => {
    if (!userProfile) {
      console.error('Perfil de usuario no disponible');
      return;
    }

    const url = rating === 0
      ? `http://localhost:3000/api/recetas/rate/${newRating}/${id}/${userProfile.id}`
      : `http://localhost:3000/api/updaterating/rate/${newRating}/${id}/${userProfile.id}`;

    try {
      const response = await fetch(url, { method: 'POST' });
      if (response.ok) {
        setRating(newRating);
        localStorage.setItem(`recipe_${id}_rating`, newRating); // Save rating to localStorage
      } else {
        console.error('Error al calificar la receta');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.opciones}>
        <h1 onClick={handleGoBack} style={{ cursor: 'pointer' }}>←</h1>
        <div ref={dropdownRef}>
          <h1 onClick={toggleDropdown} style={{ cursor: 'pointer' }}>⋮</h1>
          <DropdownMenu
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            openShareModal={openShareModal}
            openRatingModal={openRatingModal}
          />
        </div>
      </div>
      <div className={styles.recipeImageContainer}>
        <img 
          src={imagen} 
          alt={`Imagen de ${nombre}`} 
          className={styles.recipeImage}
        />
        <div className={styles.details}>
          <p>Calorías: {kcal}</p>
          <p>Tiempo: {minutos} mins</p>
          <p>Precio: ${precio}</p>
          <p>🌟 {rating}</p>
          <Bookmark recetaId={id}/> 
        </div>
      </div>
      <h1 className={styles.title}>{nombre}</h1>
      <div className={styles.creator}>
        <img src={creador.imagen} alt={creador.nombreusuario} className={styles.creadorFoto} />
        <p>Creado por: {creador.nombreusuario}</p>
      </div>

      {isShareModalOpen && (
        <ShareModal
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {isRatingModalOpen && (
        <RatingModal
          onClose={() => setIsRatingModalOpen(false)}
          onRate={handleRate}
          currentRating={rating}
        />
      )}
    </div>
  );
};

export default RecipeHeader;
