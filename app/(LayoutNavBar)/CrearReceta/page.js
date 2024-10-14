"use client"; // Asegúrate de marcar el componente como cliente

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IngredientSelector from '../../components/IngredientSelector';
import StepsList from '../../components/StepInput/StepInput'; // Cambia la importación a StepsList

const CrearReceta = () => {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [ingredientes, setIngredients] = useState([]);
  const [steps, setSteps] = useState(['']);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ingredientes');
        const data = await response.json();
        setIngredientOptions(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const idCreador = localStorage.getItem('idUsuario');

    console.log('ID del Usuario:', idCreador);

    if (!idCreador) {
      console.error("ID del usuario no encontrado");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/recetas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: recipeName,
          descripcion: description,
          ingredientes,
          pasos: steps,
          tags: [],
          idcreador: idCreador,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Recipe created successfully', data);
        // Redirigir o realizar alguna acción después de crear la receta
      } else {
        console.error('Error creating recipe', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Crear Receta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <IngredientSelector
          onIngredientsChange={setIngredients}
        />
        <StepsList steps={steps} setSteps={setSteps} />
        <button type="submit">Publicar Receta</button>
      </form>
    </div>
  );
};

export default CrearReceta;
