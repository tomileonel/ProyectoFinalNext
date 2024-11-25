'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';

const TarjetaModal = ({ isOpen, onClose, userId, onSave }) => {
  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [fechavencimiento, setFechavencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tarjetaData = {
      numero,
      titular,
      fechavencimiento,
      cvv,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/carrito/GuardarTarjeta/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarjetaData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la tarjeta');
      }

      const result = await response.json();
      console.log('Tarjeta guardada:', result);

      onSave(result.id); // Devuelve el ID al componente principal
      onClose(); // Cierra el modal
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Agregar Tarjeta</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Número de Tarjeta:
            <input
              type="text"
              className={styles.input}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Nombre del Titular:
            <input
              type="text"
              className={styles.input}
              placeholder="Nombre como aparece en la tarjeta"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Fecha de Expiración:
            <input
              type="month"
              className={styles.input}
              value={fechavencimiento}
              onChange={(e) => setFechavencimiento(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Código de Seguridad (CVV):
            <input
              type="text"
              className={styles.input}
              placeholder="XXX"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Guardar Tarjeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TarjetaModal;
