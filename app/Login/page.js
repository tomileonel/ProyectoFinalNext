"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Función para decodificar el token JWT y extraer el payload
  const decodeJWT = (token) => {
    const payloadBase64 = token.split('.')[1];  // El payload es la segunda parte del token
    const decodedPayload = atob(payloadBase64); // Decodifica de base64 a string
    return JSON.parse(decodedPayload);         // Convierte el string en objeto JSON
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);

        // Decodificar el token para extraer el idUsuario
        const decodedToken = decodeJWT(data.token);
        const idUsuario = decodedToken.id; // Extraer el ID del payload
        localStorage.setItem('idUsuario', idUsuario); // Guardar el ID en localStorage
        console.log('ID del Usuario guardado:', idUsuario);

        router.push('/Inicio');
      } else {
        setError(data.message || 'Credenciales incorrectas o error en el servidor.');
      }
    } catch (error) {
      setError('Error en la solicitud.');
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
      </form>
      <p className={styles.loginMessage}>
      ¿No tienes cuenta? <a href="/Register" className={styles.loginLink}>Registrate</a>
    </p>
    </div>
  );
};

export default LoginPage;
