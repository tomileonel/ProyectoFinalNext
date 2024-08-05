"use client"; // Indica que este es un Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter desde next/navigation
import styles from './page.module.css'; // Ajusta la ruta según sea necesario

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Usa useRouter para manejar la navegación

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías manejar la lógica de autenticación.
    console.log('Email:', email);
    console.log('Password:', password);
    // Redirigir al usuario después del inicio de sesión exitoso
    router.push('/home'); // Ajusta esta ruta según sea necesario
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
        <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
