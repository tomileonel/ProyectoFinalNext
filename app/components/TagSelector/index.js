// TagSelector.js
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const TagSelector = ({ onTagsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tags', {
          params: { nombre: searchTerm },
        });
        setFilteredTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    if (searchTerm) {
      const debounceTimeout = setTimeout(fetchTags, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setFilteredTags([]);
    }
  }, [searchTerm]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onTagsChange(newTags);
    }
  };

  const handleTagRemove = (tag) => {
    const newTags = selectedTags.filter((t) => t.id !== tag.id);
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <div>
      <label>
        Buscar Tag:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tag"
        />
      </label>
      <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
        <h3>Opciones:</h3>
        <ul>
          {filteredTags.map((tag) => (
            <li key={tag.id}>
              <button type="button" onClick={() => handleTagSelect(tag)}>
                Agregar {tag.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Tags Seleccionados:</h3>
        <ul>
          {selectedTags.map((tag) => (
            <li key={tag.id}>
              {tag.nombre}
              <button type="button" onClick={() => handleTagRemove(tag)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

TagSelector.propTypes = {
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
