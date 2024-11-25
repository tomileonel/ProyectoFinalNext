"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TagSelector = ({ initialTags = [], onTagsChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialTags); // Inicializar con tags existentes
  const [loading, setLoading] = useState(false);

  // Fetch tags based on search term
  useEffect(() => {
    if (searchTerm) {
      const fetchTags = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:3000/api/tags", {
            params: { nombre: searchTerm },
          });
          // Filtrar opciones que ya están seleccionadas
          const availableOptions = response.data.filter(
            (tag) => !selectedTags.some((item) => item.id === tag.id)
          );
          setFilteredOptions(availableOptions);
        } catch (error) {
          console.error("Error al buscar tags:", error);
        }
        setLoading(false);
      };

      const debounceTimeout = setTimeout(fetchTags, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm, selectedTags]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTag = (tag) => {
    if (!selectedTags.some((item) => item.id === tag.id)) {
      const updatedSelectedTags = [...selectedTags, tag];
      setSelectedTags(updatedSelectedTags);
      onTagsChange(updatedSelectedTags); // Send updated list to parent component
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedSelectedTags = selectedTags.filter((item) => item.id !== tag.id);
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
  initialTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  onTagsChange: PropTypes.func.isRequired,
};

export default TagSelector;
