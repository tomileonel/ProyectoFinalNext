import { useEffect, useState } from 'react';
import styles from '../components/page.module.css';

const AddRecipePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Cargar ingredientes desde la API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ingredientes');
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error('Error al obtener ingredientes:', error);
      }
    };

    fetchIngredients();
  }, []);

  // Cargar pasos de la receta seleccionada
  useEffect(() => {
    if (selectedRecipeId) {
      const fetchSteps = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/recetas/${selectedRecipeId}/pasos`);
          const data = await response.json();
          setSteps(data);
        } catch (error) {
          console.error('Error al obtener pasos:', error);
        }
      };

      fetchSteps();
    }
  }, [selectedRecipeId]);

  return (
    <div className={styles.addRecipeContainer}>
      <h2>Agregar nueva receta</h2>
      <div>
        <h3>Ingredientes</h3>
        <ul className={styles.ingredientsList}>
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.nombre} - {ingredient.precio} - {ingredient.calorias} Kcal
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Pasos de la receta</h3>
        <ul className={styles.stepsList}>
          {steps.map((step) => (
            <li key={step.id}>
              {step.nro}. {step.titulo}: {step.descripcion} ({step.duracionMin} min)
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button className={styles.addButton}>Agregar Ingrediente</button>
        <button className={styles.addButton}>Agregar Paso</button>
        <button className={styles.publishButton}>Publicar la receta</button>
      </div>
    </div>
  );
};

export default AddRecipePage;
