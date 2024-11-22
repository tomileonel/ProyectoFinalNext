"use client"
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const Modal = ({ id, isOpen, closeModal }) => {
  if (!isOpen) return null; // No renderiza el modal si no está abierto
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/recetas/fullrecipe/${id}`);
          const data = await response.json();
        
          setIngredientes(data.ingredientes);
        } catch (error) {
          console.error("Error al obtener la receta:", error);
        }
      };

      fetchReceta();
    }
  }, [id]);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal(); // Cierra el modal solo si el clic ocurre fuera del contenido
    }
  }
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
    <div className={styles.modalContent}>
      <h2 className={styles.h2}>Selecciona tus ingredientes</h2>
      <div className={styles.ingredientesContainer}>
        {ingredientes.map((ing, index) => (
          <li key={index} className={styles.ingrediente}>
            <div className={styles.container1}>
              <div className={styles.image}>
                <div className={styles.maskGroup}>
                  <div
                    className={styles.rectangle650}
                    style={{ backgroundImage: `url(${ing.imagen})` }}
                  />
                </div>
              </div>
              <div className={styles.texto}>{ing.nombre}</div>
            </div>
            <div className={styles.unidad}>
              {ing.cant}g - {ing.precio * Math.round(ing.cant / 100)}$ -{" "}
              {ing.calorias * Math.round(ing.cant / 100)}kcal
            </div>
          </li>
        ))}
      </div>
      <p className={styles.p}>
        Aquí puedes elegir los ingredientes que deseas agregar.
      </p>
    </div>
  </div>
  );
};

export default Modal;
