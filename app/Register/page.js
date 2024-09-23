"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; 

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  // Función para decodificar el token JWT y extraer el payload
  const decodeJWT = (token) => {
    const payloadBase64 = token.split('.')[1];  // El payload es la segunda parte del token
    const decodedPayload = atob(payloadBase64); // Decodifica de base64 a string
    return JSON.parse(decodedPayload);         // Convierte el string en objeto JSON
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, lastName, phone, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Almacena el token
        localStorage.setItem('token', data.token);

        // Decodificar el token para extraer el idUsuario
        const decodedToken = decodeJWT(data.token);
        const idUsuario = decodedToken.id; // Extraer el ID del payload
        localStorage.setItem('idUsuario', idUsuario); // Guardar el ID en localStorage
        console.log('ID del Usuario guardado:', idUsuario);

        alert(data.message);
        router.push('/Inicio'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        
        <button type="submit" className={styles.submitButton}>Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
