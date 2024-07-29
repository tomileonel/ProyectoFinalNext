import React from 'react';
import Link from 'next/link'; // Usa Link para navegación
import styles from './styles.module.css';

const Buttons = () => {
  return (
    <div className={styles.buttons}>
      <Link href="/Login">
        <button className={styles.loginButton}>Iniciar sesión</button>
      </Link>
      <Link href="/Register">
        <button className={styles.registerButton}>Registrarte</button>
      </Link>
    </div>
  );
};

export default Buttons;
