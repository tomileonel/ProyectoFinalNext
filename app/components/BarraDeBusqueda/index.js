import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import Image from 'next/image';
import imgOpc from '../../img/Opciones.png';
import FiltersPopup from '../FiltersPopup';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Construye la query string con los parámetros de búsqueda o parámetros básicos si está vacío
    const queryParams = query.trim() ? `query=${query}` : '';
    router.push(`/Search?${queryParams}`);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const applyFilters = (filters) => {
    // Construye la query string con los filtros aplicados
    const query = new URLSearchParams(filters).toString();
    router.push(`/Search?${query}`);
  };

  return (
    <div className={styles.header}>
      <input 
        className={styles.searchInput} 
        type="text" 
        placeholder="Busca una receta" 
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button className={styles.botonOpciones} onClick={togglePopup}>
        <Image className={styles.image} src={imgOpc} alt="Opciones" />
      </button>
      {isPopupOpen && (
        <FiltersPopup 
          onClose={togglePopup} 
          onApplyFilters={applyFilters} 
        />
      )}
    </div>
  );
};

export default SearchBar;
