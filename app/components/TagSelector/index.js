"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const TagSelector = ({ onTagsChange }) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener los IDs de tags desde la URL y convertirlos a números
    const tagsParam = searchParams.get('tags') ? searchParams.get('tags').split(',').map(Number) : [];
    setSelectedTags(tagsParam); // Almacenar solo los IDs
  }, [searchParams]);

  useEffect(() => {
    const fetchAllTags = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/tags');
        setAllTags(response.data);
        setFilteredOptions(response.data); // Inicializar las opciones filtradas
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
        setFilteredOptions(allTags); // Mostrar todos los tags si no hay búsqueda
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
    <div>
      <label>
        Buscar Tag:
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar tag"
        />
      </label>

      {loading && <p>Buscando tags...</p>}

      <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
        <h3>Tags Seleccionados:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
          {selectedTags.map(tagId => {
            const tag = allTags.find(option => option.id === tagId);
            return (
              tag && (
                <div key={tag.id} style={{ margin: '5px' }}>
                  <span>{tag.nombre}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag.id)} style={{ color: 'red' }}>
                    Eliminar
                  </button>
                </div>
              )
            );
          })}
        </div>

        <h3>Opciones:</h3>
        <ul>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => handleToggleTag(option)}
                  style={{
                    backgroundColor: selectedTags.includes(option.id) ? 'green' : 'lightgray',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    margin: '5px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  {option.nombre}
                </button>
              </li>
            ))
          ) : (
            searchTerm && !loading && (
              <li>No se encontraron tags.</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

TagSelector.propTypes = {
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
