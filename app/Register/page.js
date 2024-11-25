"use client";

import React, { useState ,useContext} from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; 
import { TokenContext } from '../context/TokenContext.js';
import countryCodes from '../utils/countrieCodes';
import { Split } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { register } = useContext(TokenContext);
  const [selectedCode, setSelectedCode] = useState('+54'); // Código por defecto

  const handleCodeChange = (e) => {
    setSelectedCode(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var PhonePlusCode = parseInt(selectedCode)+ phone
alert(PhonePlusCode)
if(phone.length != 10){
  alert("Ingrese un telefono valido")
}

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    

    const { status, message } = await register(username, name, lastName, PhonePlusCode, email, password);
    
    if (status === 200) {
      router.push("/Inicio")
      alert(message);
    } else {
      console.error(message);
    }
 
  };

  return (
    <div className={styles.formContainer}>
      <h1 >Registrarse</h1>
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
    <div className={styles.phoneInputContainer}>
      <select
        value={selectedCode}
        onChange={handleCodeChange}
        className={styles.areaCodeSelect}
      >
        {countryCodes.map((country, index) => (
          <option key={index} value={country.code}>
            {country.code} - {country.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        id="phone"
        value={phone}
        onChange={handlePhoneChange}
        required
        placeholder="Ingrese su número"
        className={styles.phoneInput}
      />
    </div>
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
      <p className={styles.loginMessage}>
      ¿Ya tienes cuenta? <a href="/Login" className={styles.loginLink}>Inicia sesión</a>
    </p>
    </div>
  );
};

export default RegisterPage;
