import React, { useState } from 'react';
import styles from './styles.module.css';

const ShareComponent = () => {
  // El modal estará abierto desde el inicio
  const [isModalOpen, setIsModalOpen] = useState(true); 
  const url = window.location.href;

  const closeModal = () => setIsModalOpen(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    // Opcional: Mostrar un mensaje de confirmación
  };

  return (
    <>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.tituloModal}>Compartir receta</h2>
            <p className={styles.descripcionModal}>
              Copie el enlace de la receta y compártalo con amigos y familiares.
            </p>
            <input 
              type="text" 
              value={url} 
              readOnly 
              className={styles.enlaceModal}
            />
            <div className={styles.modalActions}>
              <button onClick={closeModal} className={styles.botonModal}>Cerrar</button>
              <button onClick={copyLink} className={styles.botonModal}>Copiar enlace</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareComponent;
