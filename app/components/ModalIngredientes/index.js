"use client"
import React from 'react';
import styles from './styles.module.css';

const Modal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null; // No renderiza el modal si no está abierto

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeModal} onClick={closeModal}>X</button>
        <h2 className={styles.h2}>Selecciona tus ingredientes</h2>
        <p className={styles.p}>Aquí puedes elegir los ingredientes que deseas agregar.</p>

      </div>
    </div>
  );
};

export default Modal;
