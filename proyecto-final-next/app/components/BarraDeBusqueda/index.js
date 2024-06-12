import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import imgOpc from '../../img/Opciones.png';

const SearchBar = () => {
  return (
    <div className={styles.header}>
      <input className={styles.searchInput} type="text" placeholder="Busca una receta" />
      <button className={styles.botonOpciones}><Image className={styles.image} src={imgOpc} alt="Opciones" width={150} height={100} /></button>
    </div>
  );
};

export default SearchBar;
