"use client"
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
  const url = window.location.href; // Capturamos el URL actual del navegador

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.textoModal}>Compartir receta</h2>
        <p className={styles.descripcionModal}>        
          Copie el enlace de la receta y comparta el enlace de su receta con amigos y familiares.
        </p>
        <input className={styles.enlaceModal} type="text" value={url} readOnly />
        <div className={styles.modalActions}>
          <button className={styles.botonModal}onClick={onClose}>Cerrar</button>
          <button className={styles.botonModal} onClick={() => navigator.clipboard.writeText(url)}>Copiar enlace</button> {/* Copiar enlace */}
        </div>
      </div>
    </div>
  );
};

const RecipeHeader = ({ nombre, kcal, minutos, precio, creador, imagen, rating, id }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
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
    </div>
  );
};

export default RecipeHeader;