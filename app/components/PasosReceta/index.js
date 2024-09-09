// components/Timer.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const PasosReceta = ({ id, pasos }) => {
  const [seconds, setSeconds] = useState(null); // Tiempo restante total
  const [totalTime, setTotalTime] = useState(null); // Tiempo total calculado
  const [pasosDuracion, setPasosDuracion] = useState([]); // Tiempo por cada paso
  const [isActive, setIsActive] = useState(false); // Control de la cuenta regresiva
  const [pasoActual, setPasoActual] = useState(0); // Índice del paso actual

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const url = `http://localhost:3000/api/recetas/getPasosCount/${id}`;
        const response = await axios.get(url);

        // Acumular tiempo de cada paso
        const tiemposPasos = response.data.map(paso => paso.duracionMin * 60); // Convertir a segundos
        const tiempoTotal = tiemposPasos.reduce((acc, cur) => acc + cur, 0);

        setPasosDuracion(tiemposPasos);
        setSeconds(tiempoTotal);
        setTotalTime(tiempoTotal);
      } catch (error) {
        console.error("Error fetching steps and times:", error);
      }
    };

    fetchTime();
  }, [id]);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(totalTime); // Reiniciar al tiempo total original
    setPasoActual(0); // Reiniciar al primer paso
  };

  const avanzarPaso = () => {
    if (pasoActual < pasosDuracion.length - 1) {
      // Restar del tiempo total el tiempo de los pasos anteriores más el nuevo paso actual
      let tiempoRestante = totalTime;
      for (let i = 0; i <= pasoActual; i++) {
        tiempoRestante -= pasosDuracion[i];
      }
      setPasoActual(pasoActual + 1);
      setSeconds(tiempoRestante);
    }
  };

  const retrocederPaso = () => {
    if (pasoActual > 0) {
      let tiempoRestante = totalTime; // Total del tiempo
      // Restar los tiempos de los pasos anteriores hasta el paso al que se quiere retroceder
      for (let i = 0; i < pasoActual - 1; i++) {
        tiempoRestante -= pasosDuracion[i];
      }
      // Sumar el tiempo del paso al que estamos retrocediendo
      setPasoActual(pasoActual - 1);
      setSeconds(tiempoRestante);
    }
  };
  

  return (
    
    <div className="spaceNavbar">
      
      <div className={styles.timerContainer}>
        <div className={styles.time}>
          {Math.floor(seconds / 60)} : {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
        </div>

        <button className={styles.playButton} onClick={() => setIsActive(!isActive)}>
          {isActive ? "Pausar" : "Iniciar"}
        </button>
        <button className={styles.resetButton} onClick={resetTimer}>
          Reiniciar
        </button>
        
        {/* Botón Anterior */}
        <button
          className={styles.playButton}
          onClick={retrocederPaso}
          disabled={pasoActual === 0}
        >
          Anterior
        </button>
        
        {/* Botón Siguiente */}
        <button
          className={styles.resetButton}
          onClick={avanzarPaso}
          disabled={pasoActual === pasosDuracion.length - 1}
        >
          Siguiente
        </button>
      </div>

      <ol>
        {pasos.map((paso, index) => (
          <li
            key={index}

            className={`${styles.paso}
            ${
              index < pasoActual
                ? styles.completedStep // Paso ya completado (tachado)
                : index === pasoActual
                ? styles.activeStep // Paso actual (verde)
                : ""}` // Paso futuro (normal)
            }
          >
            <p>{paso.descripcion}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PasosReceta;
