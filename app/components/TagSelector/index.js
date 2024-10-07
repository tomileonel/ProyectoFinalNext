"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css'; // Asegúrate de crear este archivo CSS

const TagSelector = ({ onTagsChange }) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tagsParam = searchParams.get('tags') ? searchParams.get('tags').split(',').map(Number) : [];
    setSelectedTags(tagsParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchAllTags = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/tags');
        setAllTags(response.data);
        setFilteredOptions(response.data);
      } catch (error) {
        console.error('Error al cargar tags:', error);
      }
      setLoading(false);
    };

    fetchAllTags();
  }, []);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
        <p className={styles.description}>
          Haz clic en "Eliminar" para quitar un tag de la selección.
        </p>
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
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
