"use client"; // Indica que este es un Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter desde next/navigation
import styles from './page.module.css'; // Ajusta la ruta según sea necesario

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter(); // Usa useRouter para manejar la navegación

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías manejar la lógica de registro.
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    // Redirigir al usuario después del registro exitoso
    router.push('/home'); // Ajusta esta ruta según sea necesario
  };

  return (
    <div className={styles.formContainer}>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            Acepto los términos y condiciones
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
