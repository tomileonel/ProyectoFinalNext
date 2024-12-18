"use client"; // Asegúrate de marcar el componente como cliente

import { useState } from 'react';

const StepInput = ({ step, onStepChange, onRemove }) => {
  const handleTituloChange = (e) => onStepChange({ ...step, titulo: e.target.value });
  const handleDescripcionChange = (e) => onStepChange({ ...step, descripcion: e.target.value });
  const handleDuracionMinChange = (e) => onStepChange({ ...step, duracionMin: parseInt(e.target.value) || 0 });

  return (
    <div>
      <input 
        type="text" 
        placeholder="Título" 
        value={step.titulo} 
        onChange={handleTituloChange} 
      />
      <textarea
        placeholder="Descripción"
        value={step.descripcion}
        onChange={handleDescripcionChange}
      />
      <input
        type="number"
        placeholder="Duración (min)"
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
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  if (!Array.isArray(steps)) {
    console.error('steps debe ser un array');
    return null;
  }

  return (
    <div>
      <label>
        Pasos:
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
      </label>
    </div>
  );
};

export default StepsList;
