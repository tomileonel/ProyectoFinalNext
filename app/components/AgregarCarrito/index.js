import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { ShoppingCart } from "lucide-react";
import Counter from '../Contador';

const CartButton = ({ idRecipe }) => {
  const [sparkle, setSparkle] = useState(false);
  const [userId, setUserId] = useState(null);
  const [itemCount, setItemCount] = useState(0); // Estado para el contador de artículos

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/getUserProfile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

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

  const handleClick = async () => {
    try {
      if(itemCount > 0){
      for(let i = 0; i<itemCount; i++){
      const response = await fetch(`http://localhost:3000/api/carrito/insertCarrito/${userId}/${idRecipe}`, {
        method: 'POST'
      });
    
      if (response.ok) {
        console.log("Receta insertada correctamente");
        
      } else {
        console.log("Hubo un error insertando la receta");
      }
    }
    }
      else{
        console.log("Ingresa un valor correcto")
      }
    } catch (error) {
      console.log("Hubo un error insertando la receta", error);
    }
  

    setSparkle(true);
    setTimeout(() => setSparkle(false), 700);
  };

  return (
    <div className={styles.container}>
      <Counter itemCount={itemCount} setItemCount={setItemCount} />
      <button 
        className={styles['cart-button']} 
        aria-label="Agregar al carrito"
        onClick={handleClick}
      >
        <div className={styles['cart-button-inner']}>
          <ShoppingCart className={styles['cart-icon']} />
        </div>
        {sparkle && <div className={styles.sparkle}></div>}
      </button>
    </div>
  );
}

export default CartButton;