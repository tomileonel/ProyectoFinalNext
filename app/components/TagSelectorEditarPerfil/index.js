"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';

const TagSelector = ({ userId, onTagsChange }) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener los tags seleccionados al cargar la página
  useEffect(() => {
    const fetchUserTags = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/tags/${userId}`);
        const userTags = response.data.map(tag => tag.id); // Obtener IDs de los tags del usuario
        setSelectedTags(userTags);
      } catch (error) {
        console.error('Error al cargar tags del usuario:', error);
      }
      setLoading(false);
    };

    fetchUserTags();
  }, [userId]);

  // Obtener todos los tags
  useEffect(() => {
    const fetchAllTags = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/tags');
        setAllTags(response.data);
        setFilteredOptions(response.data);
      } catch (error) {
        console.error('Error al cargar todos los tags:', error);
      }
      setLoading(false);
    };

    fetchAllTags();
  }, []);

  // Filtrar los tags según el término de búsqueda
  useEffect(() => {
    const fetchTags = async () => {
      if (searchTerm) {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/api/tags', {
            params: { nombre: searchTerm },
          });
          setFilteredOptions(response.data);
        } catch (error) {
          console.error('Error al buscar tags:', error);
        }
        setLoading(false);
      } else {
        setFilteredOptions(allTags);
      }
    };

    const debounceTimeout = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, allTags]);

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Manejar selección o deselección de tags
  const handleToggleTag = (tag) => {
    const isSelected = selectedTags.includes(tag.id);
    const updatedSelectedTags = isSelected
      ? selectedTags.filter(id => id !== tag.id)
      : [...selectedTags, tag.id];

    setSelectedTags(updatedSelectedTags);
    onTagsChange(updatedSelectedTags);
  };

  const handleRemoveTag = (tagId) => {
    const updatedSelectedTags = selectedTags.filter(id => id !== tagId);
    setSelectedTags(updatedSelectedTags);
    onTagsChange(updatedSelectedTags);
  };

  return (
    <div className={styles.tagSelector}>
      <label className={styles.label}>
        Buscar Tag:
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar tag"
          className={styles.searchInput}
        />
      </label>

      {loading && <p className={styles.loading}>Buscando tags...</p>}

      <div className={styles.selectedTagsContainer}>
        <h3>Tags Seleccionados:</h3>
        <div className={styles.selectedTags}>
          {selectedTags.length > 0 ? (
            selectedTags.map(tagId => {
              const tag = allTags.find(option => option.id === tagId);
              return (
                tag && (
                  <div key={tag.id} className={styles.tagItem}>
                    <span className={styles.tagName}>{tag.nombre}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag.id)} className={styles.removeButton}>
                      Eliminar
                    </button>
                  </div>
                )
              );
            })
          ) : (
            <p>No se han seleccionado tags.</p>
          )}
        </div>
      </div>

      <h3>Opciones:</h3>
      <div className={styles.optionsContainer}>
        {filteredOptions.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleToggleTag(option)}
            className={`${styles.optionButton} ${selectedTags.includes(option.id) ? styles.selected : ''}`}
          >
            {option.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

TagSelector.propTypes = {
  userId: PropTypes.number.isRequired,
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
