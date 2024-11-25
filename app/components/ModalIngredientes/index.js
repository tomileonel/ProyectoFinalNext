"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Modal = ({ id, isOpen, closeModal }) => {
  if (!isOpen) return null;

  const [ingredientes, setIngredientes] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  // Fetch de ingredientes al cargar el modal
  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        const response = await fetch(
          `http://localhost:3000/api/recetas/fullrecipe/${id}`
        );
        const data = await response.json();
        setIngredientes(data.ingredientes);

        // Inicializa el estado de selección de cada ingrediente
        const seleccionInicial = {};
        data.ingredientes.forEach((ing) => {
          seleccionInicial[ing.idIngrediente] = false;
        });
        setSeleccionados(seleccionInicial);
      };

      fetchReceta();
    }
  }, [id]);

  // Manejar el cambio en el checkbox
  const handleCheckboxChange = (idIngrediente) => {
    setSeleccionados((prev) => ({
      ...prev,
      [idIngrediente]: !prev[idIngrediente], // Alternar solo el checkbox seleccionado
    }));
  };

  // Guardar los ingredientes seleccionados
  

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.h2}>Selecciona tus ingredientes</h2>
        <form className={styles.ingredientesContainer}>
          {ingredientes.map((ing) => (
            <li key={ing.idIngrediente} className={styles.ingrediente}>
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
        </form>
       
      </div>
    </div>
  );
};

export default Modal;
