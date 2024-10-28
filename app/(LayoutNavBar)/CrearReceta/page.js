"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IngredientSelector from '../../components/IngredientSelector';
import StepsList from '../../components/StepInput/StepInput';
import styles from './page.module.css';

const CrearReceta = () => {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [ingredientes, setIngredients] = useState([]);
  const [steps, setSteps] = useState([{ numero: 1, titulo: '', descripcion: '', duracionMin: 0 }]);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);  // Nuevo estado para la imagen
  const [errorMessage, setErrorMessage] = useState('');
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

  // Manejar el archivo de imagen seleccionado
  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);  // Asigna el archivo seleccionado al estado
  };

  // Función para manejar el envío del formulario
const handleSubmit = async (event) => {
  event.preventDefault();

  const idCreador = localStorage.getItem('idUsuario');
  if (!idCreador) {
    console.error("ID del usuario no encontrado");
    setErrorMessage("Por favor, inicia sesión para crear una receta.");
    return;
  }

  const formData = new FormData();
  formData.append('nombre', recipeName);
  formData.append('descripcion', description);
  formData.append('idcreador', parseInt(idCreador));
  formData.append('ingredientes', JSON.stringify(ingredientes));
  formData.append('pasos', JSON.stringify(steps));
  formData.append('tags', JSON.stringify([]));  // Si tienes tags, añádelos aquí
  if (imageFile) {
    formData.append('imagen', imageFile);  // Añadir el archivo de imagen seleccionado
  }

  try {
    const response = await fetch('http://localhost:3000/api/recetas/create', {
      method: 'POST',
      body: formData,  // Enviar FormData, no JSON
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Receta creada con éxito', data);
      router.push('/Inicio');
    } else {
      console.error('Error al crear la receta', data);
      setErrorMessage('Error al crear la receta. Por favor, intenta de nuevo.');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('Ocurrió un error al crear la receta. Por favor, intenta más tarde.');
  }
};

  return (
    <div className={styles.formContainer}>
      <h1>Crear Receta</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Nombre:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Imagen:</label>
          <input 
            type="file" 
            accept="image/*"  
            onChange={handleImageChange}
          />
        </div>

        <IngredientSelector
          options={ingredientOptions}
          onIngredientsChange={setIngredients}
        />
        <StepsList steps={steps} setSteps={setSteps} />
        <button type="submit" className={styles.submitButton}>Publicar Receta</button>
      </form>
    </div>
  );
};

export default CrearReceta;
