import { useState } from 'react';

const StepInput = ({ step, onStepChange, onRemove }) => {
  // Manejar el cambio de título
  const handleTituloChange = (e) => onStepChange({ ...step, titulo: e.target.value });
  
  // Manejar el cambio de descripción
  const handleDescripcionChange = (e) => onStepChange({ ...step, descripcion: e.target.value });
  
  // Manejar el cambio de duración en minutos
  const handleDuracionMinChange = (e) => onStepChange({ ...step, duracionMin: parseInt(e.target.value) || 0 });

  return (
    <div>
      <input 
        type="text" 
        placeholder="Título del paso" 
        value={step.titulo} 
        onChange={handleTituloChange} 
      />
      <textarea
        placeholder="Descripción del paso"
        value={step.descripcion}
        onChange={handleDescripcionChange}
      />
      <input
        type="number"
        placeholder="Duración (minutos)"
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
    setSteps([...steps, { numero: steps.length + 1, titulo: '', descripcion: '', duracionMin: 0 }]);
  };

  // Eliminar un paso
  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
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
      <button type="button" onClick={handleAddStep}>
        Agregar Paso
      </button>
    </div>
  );
};

export default StepsList;
