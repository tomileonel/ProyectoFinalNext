"use client";

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css'; // Asegúrate de crear este archivo CSS

const IngredientSelector = ({ onIngredientsChange, selectedIngredients }) => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [allIngredients, setAllIngredients] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Se establece los ingredientes seleccionados desde los parámetros de búsqueda en la URL.
    useEffect(() => {
        const ingredientsParam = searchParams.get('ingredients') ? searchParams.get('ingredients').split(',').map(Number) : [];
        const selectedIngredientsDetails = allIngredients.filter(ingredient => ingredientsParam.includes(ingredient.id));
        setFilteredOptions(selectedIngredientsDetails); // Filtrar solo los seleccionados
    }, [searchParams, allIngredients]);

    // Fetch todos los ingredientes al inicio
    useEffect(() => {
        const fetchAllIngredients = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/ingredientes');
                setAllIngredients(response.data);
                setFilteredOptions(response.data); // Inicializa las opciones con todos los ingredientes
            } catch (error) {
                console.error('Error al cargar ingredientes:', error);
            }
            setLoading(false);
        };

        fetchAllIngredients();
    }, []);

    // Filtra los ingredientes a medida que se escribe en el input de búsqueda
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
                    setFilteredOptions(allIngredients); // Si no hay búsqueda, muestra todos
                }
            } catch (error) {
                console.error('Error al buscar ingredientes:', error);
            }
            setLoading(false);
        };

        const debounceTimeout = setTimeout(fetchIngredients, 300); // Se hace un debounce para no hacer peticiones innecesarias
        console.log(allIngredients)
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

        onIngredientsChange(updatedSelectedIngredients); // Llamar la función pasada por props para actualizar el estado en el componente padre
    };

    const handleRemoveIngredient = (ingredientId) => {
        const updatedSelectedIngredients = selectedIngredients.filter(id => id !== ingredientId);
        onIngredientsChange(updatedSelectedIngredients); // Llamar la función pasada por props para actualizar el estado en el componente padre
    };

    return (
        <div className={styles.ingredientSelector}>
            <label className={styles.label}>
                Buscar Ingrediente:
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar ingrediente"
                    className={styles.searchInput}
                />
            </label>

            {loading && <p className={styles.loading}>Buscando ingredientes...</p>}

            <div className={styles.selectedIngredientsContainer}>
                <h3>Ingredientes Seleccionados:</h3>
                <p className={styles.description}>
                    Haz clic en "Eliminar" para quitar un ingrediente de la selección.
                </p>
                <div className={styles.selectedIngredients}>
                    {selectedIngredients.length > 0 ? (
                        selectedIngredients.map(ingredientId => {
                            const ingredient = allIngredients.find(option => option.id === ingredientId);
                            return (
                                ingredient && (
                                    <div key={ingredient.id} className={styles.ingredientItem}>
                                        <span className={styles.ingredientName}>{ingredient.nombre}</span>
                                        <button type="button" onClick={() => handleRemoveIngredient(ingredient.id)} className={styles.removeButton}>
                                            Eliminar
                                        </button>
                                    </div>
                                )
                            );
                        })
                    ) : (
                        <p>No se han seleccionado ingredientes.</p>
                    )}
                </div>
            </div>

            <h3>Opciones:</h3>
            <div className={styles.optionsContainer}>
                {filteredOptions.map(option => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggleIngredient(option)}
                        className={`${styles.optionButton} ${selectedIngredients.includes(option.id) ? styles.selected : ''}`}
                    >
                        {option.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
};

IngredientSelector.propTypes = {
    onIngredientsChange: PropTypes.func.isRequired,
    selectedIngredients: PropTypes.array.isRequired, // Hacer que `selectedIngredients` también sea un prop
};

export default IngredientSelector;
