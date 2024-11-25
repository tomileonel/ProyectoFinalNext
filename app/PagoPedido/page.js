'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import TarjetaModal from '../components/TarjetaModal/index'; // Modal para agregar tarjeta
import styles from './styles.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PagoPedido = () => {
  const [userId, setUserId] = useState(null); // ID del usuario
  const [carrito, setCarrito] = useState([]); // Productos en el carrito
  const [total, setTotal] = useState(0); // Total del carrito
  const [tarjeta, setTarjeta] = useState(null); // Información de la tarjeta del usuario
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
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
            setUserId(data.id); // Guardar ID del usuario
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
          setCarrito(data); // Guardar los datos del carrito
          const totalPrecio = data.reduce((acc, item) => acc + item.precio, 0);
          setTotal(totalPrecio); // Calcular total del carrito
        } catch (error) {
          console.error('Error al obtener el carrito:', error);
        }
      }
    };

    fetchCarrito();
  }, [userId]);

  // Verificar si el usuario tiene una tarjeta
  useEffect(() => {
    const fetchTarjeta = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/getTarjetaFromUser/${userId}`
          );

          if (response.status === 200) {
            setTarjeta(response.data); // Guardar información de la tarjeta
          } else {
            setTarjeta(null); // No hay tarjeta registrada
          }
        } catch (error) {
          console.error('Error al obtener la tarjeta del usuario:', error);
          setTarjeta(null); // Manejo de error, no hay tarjeta
        }
      }
    };

    fetchTarjeta();
  }, [userId]);

  const handleGoBack = () => {
    router.push('/Carrito');
  };

  const handlePagarPedido = () => {
    if (tarjeta) {
      alert('Pago realizado exitosamente con la tarjeta registrada.');
      router.push('/resumen'); // Redirige a la página de resumen
    } else {
      alert('Por favor, registra una tarjeta antes de continuar.');
    }
  };

  return (
    <>
      <div className={styles.container}>
        {/* Encabezado */}
        <div className={styles.header}>
          <button onClick={handleGoBack} className={styles['back-button']}>
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Pago del Pedido</h1>
        </div>

        {/* Detalles de las recetas */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Detalles del Pedido</h2>
          {carrito.length > 0 ? (
            carrito.map((item, index) => (
              <div className={styles['order-item']} key={index}>
                <div className={styles['item-container']}>
                  <img
                    src={`http://localhost:3000${item.imagen}` || '/api/placeholder/80/80'}
                    alt={item.nombre}
                    className={styles['item-image']}
                  />
                  <div className={styles['item-details']}>
                    <div className={styles['item-header']}>
                      <h3 className={styles['item-name']}>{item.nombre}</h3>
                      <span className={styles['item-price']}>
                        {item.precio}$
                      </span>
                    </div>
                    <p className={styles['item-description']}>
                      {item.descripcion || 'Descripción no disponible'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Cargando recetas...</p>
          )}
        </div>

        {/* Método de Pago */}
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Método de Pago</h2>
          {tarjeta ? (
            <p className={styles['payment-info']}>
              Tarjeta que finaliza en{' '}
              <strong>{tarjeta.numero.slice(-4)}</strong>
            </p>
          ) : (
            <button
              className={styles['add-card-button']}
              onClick={() => setIsModalOpen(true)}
            >
              Agregar Tarjeta
            </button>
          )}
        </div>

        {/* Resumen del Pago */}
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
            onClick={handlePagarPedido} // Llama a la función para realizar el pago
          >
            Pagar Pedido
          </button>
        </div>
      </div>

      {/* Modal de Tarjeta */}
      <TarjetaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        onSave={() => setTarjeta(null)} // Forzar recarga de tarjeta después de agregar
      />
    </>
  );
};

export default PagoPedido;
