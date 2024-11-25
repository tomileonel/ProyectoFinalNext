"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IngredientSelector from '../components/IngredientSelector';
import StepsList from '../components/StepsList/StepsList';
import TagSelector from '../components/TagsSelectorCrearReceta/tagsSelector.js';
import styles from './page.module.css';

const CrearReceta = () => {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [ingredientes, setIngredients] = useState([]);
  const [steps, setSteps] = useState([{ numero: 1, titulo: '', descripcion: '', duracionMin: 0 }]);
  const [tags, setTags] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSection, setCurrentSection] = useState(0);

  const router = useRouter();

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

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleTagsChange = (selectedTags) => {
    setTags(selectedTags);
  };

  const handleNextSection = () => {
    if (currentSection < 4) setCurrentSection(currentSection + 1);
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const idCreador = localStorage.getItem('idUsuario');
    if (!idCreador) {
      setErrorMessage("Por favor, inicia sesión para crear una receta.");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', recipeName);
    formData.append('descripcion', description);
    formData.append('idcreador', parseInt(idCreador));
    formData.append('ingredientes', JSON.stringify(ingredientes));
    formData.append('pasos', JSON.stringify(steps));
    formData.append('tags', JSON.stringify(tags));
    if (imageFile) formData.append('imagen', imageFile);

    try {
      const response = await fetch('http://localhost:3000/api/recetas/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/Inicio');
      } else {
        setErrorMessage('Error al crear la receta. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error al crear la receta. Por favor, intenta más tarde.');
    }
  };

  const sections = [
    {
      title: 'Información básica',
      content: (
        <>
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
        </>
      ),
    },
    {
      title: 'Ingredientes',
      content: (
        <IngredientSelector
          options={ingredientOptions}
          onIngredientsChange={setIngredients}
        />
      ),
    },
    {
      title: 'Pasos',
      content: (
        <StepsList
          steps={steps}
          setSteps={setSteps}
          layout="titulo-descripcion-tiempo" // Nuevo layout
        />
      ),
    },
    {
      title: 'Etiquetas',
      content: <TagSelector onTagsChange={handleTagsChange} />,
    },
  ];

  return (
    <div className={styles.formContainer}>
      <h1>Crear Receta</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2>{sections[currentSection].title}</h2>
          {sections[currentSection].content}
        </div>

        <div className={styles.navigation}>
          {currentSection > 0 && (
            <button type="button" onClick={handlePreviousSection} className={styles.submitButton}>
              Anterior
            </button>
          )}
          {currentSection < sections.length - 1 ? (
            <button type="button" onClick={handleNextSection} className={styles.submitButton}>
              Siguiente
            </button>
          ) : (
            <button type="submit" className={styles.submitButton}>
              Publicar Receta
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CrearReceta;
