'use client';
import React, { useState } from "react";
import PasosReceta from "../PasosReceta";
import styles from './styles.module.css';

const RecipeSwitch = ({ ingredientes, pasos, idreceta }) => {
  const [activeTab, setActiveTab] = useState("ingredientes");

  return (
    <div className={styles.switchContainer}>
      <div className={styles.tabs}>
      <button
        className={`${styles.categoryButton} ${
        activeTab === "ingredientes" ? styles.active : ""
        }`}
        onClick={() => setActiveTab("ingredientes")}>
      Ingredientes
    </button>
    <button
        className={`${styles.categoryButton} ${
        activeTab === "pasos" ? styles.active : ""
        }`}
        onClick={() => setActiveTab("pasos")}>
      Pasos
      </button>
      </div>
      <div className={styles.content}>
  {activeTab === "ingredientes" && (
    <ul>
      {ingredientes.map((ing, index) => (
        <li key={index} className={styles.ingrediente}>
          <div className={styles.container1}>
            <div className={styles.image}>
              <div className={styles.maskGroup}>
                <div
                  className={styles.rectangle650}
                  style={{ backgroundImage: `url(${ing.imagen})` }}
                />
              </div>
            </div>
            <div className={styles.texto}>
              {ing.nombre}
            </div>
          </div>
          <div className={styles.unidad}>
            {ing.cant} - {ing.precio}$ - {ing.kcal}Kcal
          </div>
        </li>
      ))}
    </ul>
  )}

        {activeTab === "pasos" && (
        <PasosReceta id={idreceta}
         pasos={pasos}/>
        )}
      </div>
    </div>
  );
};

export default RecipeSwitch;
