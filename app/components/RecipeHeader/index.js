// index.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import Bookmark from "../BookmarkFavoritos";
import styles from './styles.module.css';
import ShareComponent from "../CompartirModal";
import RatingComponent from "../RatingModal";

const DropdownMenu = ({ isOpen, onClose, openShare, openRating }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownItem} onClick={openShare}>
        <span>↗</span> Compartir
      </div>
      <div className={styles.dropdownItem} onClick={openRating}>
        <span>★</span> Calificar
      </div>
      <div className={styles.dropdownItem}>
        <span>💬</span> Comentar
      </div>
    </div>
  );
};

const RecipeHeader = ({ id, nombre, kcal, minutos, precio, creador, imagen, rating }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showShareComponent, setShowShareComponent] = useState(false);
  const [showRatingComponent, setShowRatingComponent] = useState(false);

  const dropdownRef = useRef(null);
  console.log(id);
  const handleGoBack = () => {
    window.history.back();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openShare = () => {
    setShowShareComponent(true);
    setShowRatingComponent(false); // Ocultar el componente de calificación si se abre compartir
  };

  const openRating = () => {
    setShowRatingComponent(true);
    setShowShareComponent(false); // Ocultar compartir si se abre calificar
  };

  const closeRating = () => {
    setShowRatingComponent(false); // Cerrar el modal de calificación
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
            openShare={openShare}
            openRating={openRating}
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

      {showShareComponent && (
        // Mostrar el componente ShareComponent directamente
        <ShareComponent />
      )}

      {showRatingComponent && (
        // Mostrar el componente RatingComponent directamente
        <RatingComponent idReceta={id} modalState={showRatingComponent} closeModal={closeRating} />
      )}
    </div>
  );
};

export default RecipeHeader;
