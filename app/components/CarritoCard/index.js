"use client"
import styles from './styles.module.css';
import React, { useState } from 'react';
import Modal from '../ModalIngredientes';

const CarritoCard = ({ imagen, nombre, kcal, minutos, precio, id, idReceta, idUsuario }) => {
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad de la tarjeta
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar si el modal está abierto
  const imageUrl = imagen ? `http://localhost:3000${imagen}` : '/path/to/default-image.jpg';
  console.log(idReceta)
  const handleRemove = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/carrito/DeleteCarrito/${id}`, {
        method: 'DELETE', // Asegúrate de que el método sea DELETE
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al borrar el artículo');
      }

      setIsVisible(false); // Ocultar la tarjeta
    } catch (error) {
      console.log('Error borrando, error:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  if (!isVisible) return null; // Si no es visible, no renderizamos la tarjeta

  return (
    <div className={styles.recipeImageContainer}>
      {/* Imagen de la receta */}
      <img 
        src={imageUrl}
        alt={`Imagen de ${nombre}`} 
        className={styles.recipeImage}
      />

      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleRemove}>×</button>
      </div>

      {/* Detalles de la receta */}
      <div className={styles.details}>
        <div className={styles.titulo}>
          {nombre}
        </div>
        
        <div className={styles.datos}>
          <p>Calorías: {kcal}</p>
          <p>Tiempo: {minutos} mins</p>
          <p>Precio: ${precio}</p>
        </div>
        <div className={styles.ingredientsSection} onClick={openModal}>
        <span className={styles.chooseIngredients}>Elegir ingredientes</span>
        <span className={styles.arrow} >&gt;</span>
      </div>
      </div>

      {/* Nueva sección con el texto y la flecha */}
      

      
      <Modal id={idReceta}  isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default CarritoCard;
