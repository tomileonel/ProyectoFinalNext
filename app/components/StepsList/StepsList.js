import { useState } from 'react';
import styles from './styles.module.css';

const StepInput = ({ step, onStepChange, onRemove }) => {
  // Manejar el cambio de título
  const handleTituloChange = (e) => onStepChange({ ...step, titulo: e.target.value });
  
  // Manejar el cambio de descripción
  const handleDescripcionChange = (e) => onStepChange({ ...step, descripcion: e.target.value });
  
  // Manejar el cambio de duración en minutos
  const handleDuracionMinChange = (e) => onStepChange({ ...step, duracionMin: parseInt(e.target.value) || 0 });

  return (
    <div className={styles.stepInputContainer}>
      <input 
        type="text" 
        placeholder="Ingresar Título" 
        value={step.titulo} 
        onChange={handleTituloChange} 
      />
      <textarea
        placeholder="Ingresar Descripción"
        value={step.descripcion}
        onChange={handleDescripcionChange}
      />
      <input
        type="number"
        placeholder="Ingresar Tiempo (minutos)"
        value={step.duracionMin}
        onChange={handleDuracionMinChange}
      />
      <button type="button" onClick={onRemove}>
        Eliminar Paso
      </button>
    </div>
  );
};

const StepsList = ({ steps, setSteps }) => {
  // Agregar un nuevo paso
  const handleAddStep = () => {
    setSteps([
      ...steps,
      { nro: steps.length + 1, titulo: '', descripcion: '', duracionMin: 0 }, // Cambié 'numero' por 'nro'
    ]);
  };

  // Eliminar un paso y reasignar números
  const handleRemoveStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    // Reasignar números de paso después de eliminar
    setSteps(updatedSteps.map((step, i) => ({ ...step, nro: i + 1 })));
  };

  // Manejar cambios en un paso específico
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  return (
    <div>
      <h3>Pasos de la Receta</h3>
      {steps.map((step, index) => (
        <StepInput
          key={index}
          step={step}
          onStepChange={(value) => handleStepChange(index, value)}
          onRemove={() => handleRemoveStep(index)}
        />
      ))}
      <button
        type="button"
        className={styles.addStepButton}
        onClick={handleAddStep}
      >
        Agregar Paso
      </button>
    </div>
  );
};

export default StepsList;
