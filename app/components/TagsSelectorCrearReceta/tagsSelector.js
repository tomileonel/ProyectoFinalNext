// src/components/TagSelector.js
"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const TagSelector = ({ onTagsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tags based on search term
  useEffect(() => {
    if (searchTerm) {
      const fetchTags = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/api/tags', {
            params: { nombre: searchTerm }
          });
          setFilteredOptions(response.data);
        } catch (error) {
          console.error('Error al buscar tags:', error);
        }
        setLoading(false);
      };

      const debounceTimeout = setTimeout(fetchTags, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTag = (tag) => {
    if (!selectedTags.some(item => item.id === tag.id)) {
      const updatedSelectedTags = [...selectedTags, tag];
      setSelectedTags(updatedSelectedTags);
      onTagsChange(updatedSelectedTags); // Send updated list to parent component
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedSelectedTags = selectedTags.filter(item => item.id !== tag.id);
    setSelectedTags(updatedSelectedTags);
    onTagsChange(updatedSelectedTags); // Send updated list to parent component
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

      <ul>
        {filteredOptions.map((tag) => (
          <li key={tag.id}>
            {tag.nombre}
            <button type="button" onClick={() => handleAddTag(tag)}>Agregar</button>
          </li>
        ))}
      </ul>

      <h3>Tags Seleccionados:</h3>
      <ul>
        {selectedTags.map((tag) => (
          <li key={tag.id}>
            {tag.nombre}
            <button type="button" onClick={() => handleRemoveTag(tag)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TagSelector.propTypes = {
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
