'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import TarjetaModal from '../components/TarjetaModal/index';
import styles from './styles.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PagoPedido = () => {
  const [userId, setUserId] = useState(null); // ID del usuario
  const [carrito, setCarrito] = useState([]); // Productos en el carrito
  const [total, setTotal] = useState(0); // Total del carrito
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [paymentMethod, setPaymentMethod] = useState(''); // 'efectivo' o 'tarjeta'
  const [tarjetaId, setTarjetaId] = useState(null); // ID de la tarjeta guardada
  const router = useRouter();

  // Obtener el perfil del usuario
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(
            'http://localhost:3000/api/auth/getUserProfile',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
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

  // Obtener los datos del carrito
  useEffect(() => {
    const fetchCarrito = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/carrito/getInfoCarrito/${userId}`
          );
          const data = response.data;
          setCarrito(data);
          const totalPrecio = data.reduce((acc, item) => acc + item.precio, 0);
          setTotal(totalPrecio);
        } catch (error) {
          console.error('Error al obtener el carrito:', error);
        }
      }
    };

    fetchCarrito();
  }, [userId]);

  // Manejar la elección del método de pago
  const handleSavePaymentMethod = async () => {
    if (!userId) return;

    const paymentData = {
      tarjeta: paymentMethod === 'tarjeta' ? tarjetaId : null,
      efectivo: paymentMethod === 'efectivo',
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/SavePaymentMethod/${userId}`,
        paymentData
      );

      if (response.status === 200) {
        console.log('Método de pago guardado:', response.data);
        alert('Método de pago guardado correctamente');
        router.push('/resumen');
      } else {
        console.error('Error al guardar el método de pago');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleGoBack = () => {
    router.push('/carrito');
  };

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={handleGoBack} className={styles['back-button']}>
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Pago del Pedido</h1>
        </div>

        {/* Payment Method */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Método de Pago</h2>
          <div className={styles['radio-group']}>
            <label className={styles['radio-option']}>
              <input
                type="radio"
                name="payment-method"
                checked={paymentMethod === 'efectivo'}
                onChange={() => setPaymentMethod('efectivo')}
              />
              <div>
                <div className={styles['radio-label-text']}>Efectivo</div>
              </div>
            </label>
            <label className={styles['radio-option']}>
              <input
                type="radio"
                name="payment-method"
                checked={paymentMethod === 'tarjeta'}
                onChange={() => setPaymentMethod('tarjeta')}
              />
              <div>
                <div className={styles['radio-label-text']}>Tarjeta</div>
              </div>
            </label>
          </div>
          {paymentMethod === 'tarjeta' && (
            <button
              className={styles['add-card-button']}
              onClick={() => setIsModalOpen(true)}
            >
              Agregar Tarjeta
            </button>
          )}
        </div>

        {/* Payment Summary */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Resumen de Pago</h2>
          <div className="space-y-2">
            <div className={styles['summary-item']}>
              <span className={styles['summary-label']}>
                Precio ({carrito.length} elemento
                {carrito.length !== 1 ? 's' : ''})
              </span>
              <span>{total}$</span>
            </div>
            <div className={`${styles['summary-item']} ${styles.total}`}>
              <span>Total</span>
              <span>{total}$</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles['pay-button']}
            onClick={handleSavePaymentMethod}
          >
            Confirmar y Guardar Método de Pago
          </button>
        </div>
      </div>

      {/* Modal de Tarjeta */}
      <TarjetaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        onSave={(id) => setTarjetaId(id)} // Guarda el ID de la tarjeta
      />
    </>
  );
};

export default PagoPedido;
