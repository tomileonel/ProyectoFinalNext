"use client"; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IngredientSelector from '../../components/IngredientSelector';
import StepsList from '../../components/StepInput/StepInput';

const CrearReceta = () => {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [ingredientes, setIngredients] = useState([]);
  const [steps, setSteps] = useState([{ numero: 1, titulo: '', descripcion: '', duracionMin: 0 }]); // Pasos con estructura inicial
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar mensajes de error
  const router = useRouter();

  // Fetch de ingredientes
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ingredientes');
        if (!response.ok) throw new Error('Error fetching ingredients');
        const data = await response.json();
        setIngredientOptions(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setErrorMessage('Error al cargar los ingredientes. Intenta nuevamente.');
      }
    };

    fetchIngredients();
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el ID de usuario está en localStorage
    const idCreador = localStorage.getItem('idUsuario');
    if (!idCreador) {
      console.error("ID del usuario no encontrado");
      setErrorMessage("Por favor, inicia sesión para crear una receta.");
      return;
    }

    // Preparar la data para enviar
    const recetaData = {
      nombre: recipeName,
      descripcion: description,
      ingredientes,
      pasos: steps,
      tags: [], // Si hay tags, añádelos aquí
      idcreador: parseInt(idCreador), // Asegúrate de que sea un número
    };

    try {
      const response = await fetch('http://localhost:3000/api/recetas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recetaData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Recipe created successfully', data);
        router.push('/Inicio'); // Redirigir a una página de recetas o éxito
      } else {
        console.error('Error creating recipe', data);
        setErrorMessage('Error al crear la receta. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Ocurrió un error al crear la receta. Por favor, intenta más tarde.');
    }
  };

  return (
    <div>
      <h1>Crear Receta</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
          options={ingredientOptions}
          onIngredientsChange={setIngredients}
        />
        <StepsList steps={steps} setSteps={setSteps} />
        <button type="submit">Publicar Receta</button>
      </form>
    </div>
  );
};

export default CrearReceta;
