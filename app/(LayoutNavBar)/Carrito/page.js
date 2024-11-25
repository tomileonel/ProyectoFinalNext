"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import CarritoCard from "@/app/components/CarritoCard";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const [userId, setUserId] = useState(null);
  const [recetas, setRecetas] = useState([]); // Guardar las recetas del carrito
  const [total, setTotal] = useState(0); // Almacenar el precio total del carrito
  const router = useRouter();

  // Obtener el perfil del usuario
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:3000/api/auth/getUserProfile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
          } else {
            console.error("Error al obtener el perfil del usuario");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      } else {
        console.error("Token no encontrado");
      }
    };
    fetchUserProfile();
  }, []);

  // Obtener los datos del carrito (recetas e ingredientes) y calcular el total
  useEffect(() => {
    const fetchRecetasCarrito = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/carrito/getInfoCarrito/${userId}`
          );
          const data = response.data;

          // Guardar las recetas
          setRecetas(data);

          // Calcular el precio total del carrito
          const totalPrecio = data.reduce((acc, receta) => acc + receta.precio, 0);
          setTotal(totalPrecio);
        } catch (error) {
          console.error("Hubo un error consiguiendo las recetas: ", error);
        }
      }
    };
    fetchRecetasCarrito();
  }, [userId]);

  // Manejar clic en el botón "Pagar"
  const handlePagar = () => {
    router.push("/PagoPedido");
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Cesta</p>

      {/* Mapeo de las recetas */}
      {recetas.length > 0 ? (
        recetas.map((receta, index) => (
          <CarritoCard
            key={index}
            imagen={receta.imagen}
            nombre={receta.nombre}
            kcal={receta.calorias}
            minutos={receta.tiempoMins}
            precio={receta.precio}
            id={receta.id}
            idReceta={receta.idReceta}
            idUsuario={userId}
          />
        ))
      ) : (
        <p>Cargando recetas...</p>
      )}

      {/* Resumen del carrito */}
      <div className={styles.resumen}>
        <p>{recetas.length} elemento(s)</p>
        <p>{`${total}$`}</p>
      </div>

      {/* Botón para ir a la página de pago */}
      <button className={styles.pagarBtn} onClick={handlePagar}>
        Pagar
      </button>
    </div>
  );
}
