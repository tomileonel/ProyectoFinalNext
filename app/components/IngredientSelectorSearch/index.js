"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const IngredientSelector = ({ onIngredientsChange }) => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [allIngredients, setAllIngredients] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Obtener los IDs de ingredientes desde la URL y convertirlos a números
        const ingredientsParam = searchParams.get('ingredients') ? searchParams.get('ingredients').split(',').map(Number) : [];
        setSelectedIngredients(ingredientsParam); // Almacenar solo los IDs

        // Inicializar las opciones filtradas para incluir ingredientes seleccionados
        const selectedIngredientsDetails = allIngredients.filter(ingredient => ingredientsParam.includes(ingredient.id));
        setFilteredOptions(prev => [...prev, ...selectedIngredientsDetails]);
    }, [searchParams, allIngredients]);

    useEffect(() => {
        const fetchAllIngredients = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/ingredientes');
                setAllIngredients(response.data);
                setFilteredOptions(response.data); // Inicializar las opciones filtradas
            } catch (error) {
                console.error('Error al cargar ingredientes:', error);
            }
            setLoading(false);
        };

        fetchAllIngredients();
    }, []);

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            try {
                if (searchTerm) {
                    const response = await axios.get('http://localhost:3000/api/ingredientes', {
                        params: { search: searchTerm },
                    });
                    setFilteredOptions(response.data);
                } else {
                    setFilteredOptions(allIngredients); // Mostrar todos los ingredientes si no hay búsqueda
                }
            } catch (error) {
                console.error('Error al buscar ingredientes:', error);
            }
            setLoading(false);
        };

        const debounceTimeout = setTimeout(fetchIngredients, 300);
        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, allIngredients]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggleIngredient = (ingredient) => {
        const isSelected = selectedIngredients.includes(ingredient.id);
        const updatedSelectedIngredients = isSelected
            ? selectedIngredients.filter(id => id !== ingredient.id)
            : [...selectedIngredients, ingredient.id];

        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients); // Propagar el cambio
    };

    const handleRemoveIngredient = (ingredientId) => {
        const updatedSelectedIngredients = selectedIngredients.filter(id => id !== ingredientId);
        setSelectedIngredients(updatedSelectedIngredients);
        onIngredientsChange(updatedSelectedIngredients); // Propagar el cambio
    };

    return (
        <div>
            <label>
                Buscar Ingrediente:
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar ingrediente"
                />
            </label>

            {loading && <p>Buscando ingredientes...</p>}

            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
                <h3>Ingredientes Seleccionados:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {selectedIngredients.map(ingredientId => {
                        const ingredient = allIngredients.find(option => option.id === ingredientId);
                        return (
                            ingredient && (
                                <div key={ingredient.id} style={{ margin: '5px' }}>
                                    <span>{ingredient.name}</span> {/* Cambiado a ingredient.name */}
                                    <button type="button" onClick={() => handleRemoveIngredient(ingredient.id)} style={{ color: 'red' }}>
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
                                    onClick={() => handleToggleIngredient(option)}
                                    style={{
                                        backgroundColor: selectedIngredients.includes(option.id) ? 'green' : 'lightgray',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        margin: '5px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {option.name} {/* Cambiado a option.name */}
                                </button>
                            </li>
                        ))
                    ) : (
                        searchTerm && !loading && (
                            <li>No se encontraron ingredientes.</li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
};

IngredientSelector.propTypes = {
    onIngredientsChange: PropTypes.func.isRequired,
};

export default IngredientSelector;
