import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import Image from 'next/image';
import imgOpc from '../../img/Opciones.png';
import FiltersPopup from '../FiltersPopup';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para obtener los parámetros actuales de la URL

  // Actualizar el valor del campo de búsqueda con el valor actual en los parámetros de la URL
  useEffect(() => {
    const initialQuery = searchParams.get('query') || '';
    setSearchQuery(initialQuery);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Mantén los filtros existentes y solo actualiza la query
    const params = new URLSearchParams(window.location.search); // Tomar la URL actual
    if (query.trim()) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    router.push(`/Search?${params.toString()}`); // Solo modifica la query en la URL sin tocar los demás parámetros
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const applyFilters = (filters) => {
    // Mantén la búsqueda actual en los parámetros y añade los filtros
    const params = new URLSearchParams(window.location.search); // Mantén los parámetros actuales de la URL
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value); // Actualiza el valor de cada filtro
      } else {
        params.delete(key);  // Elimina el parámetro si está vacío
      }
    });

    router.push(`/Search?${params.toString()}`); // Aplica los nuevos filtros y mantiene la query
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
