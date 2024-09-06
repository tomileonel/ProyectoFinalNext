"use client"; // Asegúrate de marcar el componente como cliente

import { useState } from 'react';

const StepInput = ({ step, onStepChange, onRemove }) => {
  return (
    <div>
      <textarea
        value={step}
        onChange={(e) => onStepChange(e.target.value)}
        placeholder="Paso"
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
    // Asegúrate de que steps sea un array
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
