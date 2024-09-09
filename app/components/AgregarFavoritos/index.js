import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'; // Asegúrate de tener los estilos necesarios
import IngredientSelector from '../../components/IngredientSelector/IngredientSelector'; // Asegúrate de que la ruta sea correcta

const AgregarReceta = () => {
    const [nombre, setNombre] = useState('');
    const [ingredientes, setIngredientes] = useState([]);
    const [pasos, setPasos] = useState('');
    const [userId, setUserId] = useState(null);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/auth/getUserProfile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Agrega el token en el encabezado Authorization
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.id); // Establece el ID del usuario desde el perfil
                } else {
                    console.error('Error al obtener el perfil del usuario');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        } else {
            console.error('Token no encontrado');
        }
    };

    // Llama a la función para obtener el perfil del usuario cuando el componente se monta
    React.useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || ingredientes.length === 0 || !pasos) {
            alert('Por favor, completa todos los campos antes de enviar.');
            return;
        }

        const recetaData = {
            nombre,
            ingredientes,
            pasos,
            userId, // Incluye el ID del usuario que está creando la receta
        };

        try {
            const response = await axios.post('http://localhost:3000/api/recetas', recetaData);

            if (response.status === 201) {
                alert('Receta agregada con éxito');
                // Limpiar el formulario
                setNombre('');
                setIngredientes([]);
                setPasos('');
            } else {
                console.error('Error al agregar la receta:', response);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Agregar Receta</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre de la receta:</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Ingredientes:</label>
                    <IngredientSelector onIngredientsChange={setIngredientes} />
                    <ul>
                        {ingredientes.map((ingrediente, index) => (
                            <li key={index}>{ingrediente.nombre} - {ingrediente.quantity}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="pasos">Pasos:</label>
                    <textarea 
                        id="pasos" 
                        value={pasos} 
                        onChange={(e) => setPasos(e.target.value)} 
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Agregar Receta</button>
            </form>
        </div>
    );
};

export default AgregarReceta;
