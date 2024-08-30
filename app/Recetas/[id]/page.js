"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DetalleReceta = ({params}) => {
  const router = useRouter();
  const { id } = params|| {};  // Asegúrate de que `id` sea undefined si `router.query` no está disponible
  const [receta, setReceta] = useState(null);

  useEffect(() => {
    if (id) {
      // Aquí iría tu lógica para obtener la receta con el `id`
      const fetchReceta = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/recetas/${id}`);
          const data = await response.json();
          setReceta(data);
        } catch (error) {
          console.error('Error al obtener la receta:', error);
        }
      };

      fetchReceta();
    }
  }, [id]); // Dependencia de `id`, el efecto solo se ejecutará cuando `id` esté disponible

  if (!id) {
    return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga mientras se obtiene el ID
  }

  return (
    <div>
      {receta ? (
        <div>
          <h1>{receta.nombre}</h1>
          {/* Aquí puedes mostrar los detalles de la receta */}
        </div>
      ) : (
        <div>Cargando receta...</div>
      )}
    </div>
  );
};

export default DetalleReceta;
