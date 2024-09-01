import React, { useState } from "react";
import styles from './styles.module.css';

const RecipeSwitch = ({ ingredientes, pasos }) => {
  const [activeTab, setActiveTab] = useState("ingredientes");

  return (
    <div className={styles.switchContainer}>
      <div className={styles.tabs}>
        <button
          className={activeTab === "ingredientes" ? styles.activeTab : ""}
          onClick={() => setActiveTab("ingredientes")}
        >
          Ingredientes
        </button>
        <button
          className={activeTab === "pasos" ? styles.activeTab : ""}
          onClick={() => setActiveTab("pasos")}
        >
          Pasos
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "ingredientes" && (
          <ul>
            {ingredientes.map((ing, index) => (
              <li key={index}>
                <img src={ing.imagen} alt={ing.nombre} className={styles.ingredienteFoto} />
                <p>{ing.nombre} - {ing.cant}</p>
              </li>
            ))}
          </ul>
        )}
        {activeTab === "pasos" && (
          <ol>
            {pasos.map((paso, index) => (
              <li key={index}>
                <p>{paso.descripcion}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default RecipeSwitch;
