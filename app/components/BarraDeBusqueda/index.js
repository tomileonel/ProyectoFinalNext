import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import imgOpc from '../../img/Opciones.png';

const SearchBar = () => {
  return (
    <div className={styles.header}>
      <input className={styles.searchInput} type="text" placeholder="Busca una receta" />
      <button className={styles.botonOpciones}>
        <Image className={styles.image} src={imgOpc} alt="Opciones"  />
        </button>
    </div>
  );
};

export default SearchBar;
