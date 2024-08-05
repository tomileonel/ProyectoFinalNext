"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (response.ok) {

        router.push('/');
      } else {
        const result = await response.json();
        setError(result.message || 'Credenciales incorrectas o error en el servidor.');
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
    </div>
  );
};

export default LoginPage;
