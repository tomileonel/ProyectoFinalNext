"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RecipeHeader from "../../components/RecipeHeader/index";
import RecipeSwitch from "../../components/RecipeSwitch/index";
import styles from "./page.module.css"
const DetalleReceta = () => {
  const { id } = useParams(); // Obtén el ID directamente de los params
  const [receta, setReceta] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/recetas/fullrecipe/${id}`);
          const data = await response.json();
          setReceta(data);
        } catch (error) {
          console.error("Error al obtener la receta:", error);
        }
      };

      fetchReceta();
    }
  }, [id]);
  
  if (!receta) {
    return <div>Cargando receta...</div>;
  }

  return (
    <div className={styles.maincontent}>
      <RecipeHeader 
        id = {id}
        nombre={receta.nombre}
        imagen={receta.imagen}
        kcal={receta.calorias}
        minutos={receta.tiempoMins}
        precio={receta.precio}
        creador={receta.creador}
        rating={receta.rating}
      />
      <RecipeSwitch 
        ingredientes={receta.ingredientes}
        pasos={receta.pasos}
        idreceta = {id}
      />
    </div>
  );
};

export default DetalleReceta;
