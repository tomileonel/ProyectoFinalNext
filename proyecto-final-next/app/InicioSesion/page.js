"use client";
import React from 'react';
import Logo from '../components/LogoInicioSesion/index'
import styles from './page.module.css';
import Buttons from '../components/ButtonsInicio/index'
const InicioSesion = () => {
  return (
    <div className={styles.container}>
    <Logo/>  
    <Buttons/>
    </div>
  );
};

export default InicioSesion;