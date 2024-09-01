import axios from 'axios';
import React, { useEffect, useState } from 'react';
import bookmark from '../../img/bookmark.png';
import bookmarked from '../../img/bookmarked.png';
import Image from 'next/image';
import styles from './styles.module.css';

const Bookmark = ({ nombre }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [id, setId] = useState(null);
    const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
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

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const obtenerIdPorNombre = async (nombre) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/recetas/getIdByName/${nombre}`);
                const id = response.data.recordset?.[0]?.id || null;
                return id;
            } catch (error) {
                console.error('No se pudo obtener el ID por nombre:', error);
                return null;
            }
        };

        const inicializarFavorito = async () => {
            const fetchedId = await obtenerIdPorNombre(nombre);
            if (fetchedId) {
                setId(fetchedId);

                // Cargar estado desde localStorage
                const storedFavorite = localStorage.getItem('favorites');
                const favorites = storedFavorite ? JSON.parse(storedFavorite) : {};

                if (fetchedId in favorites) {
                    setIsFavorite(favorites[fetchedId]);
                } else {
                    if (userId !== null) { // Asegúrate de que userId esté definido
                        try {
                            const response = await axios.get(`http://localhost:3000/api/favoritos/getFavourites/${userId}/${fetchedId}`);
                            const isFavorite = response.data.isFavorite;
                            setIsFavorite(isFavorite);
                            favorites[fetchedId] = isFavorite;
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                        } catch (error) {
                            console.error('No se pudo verificar el favorito:', error);
                        }
                    }
                }
            }
        };

        inicializarFavorito();
    }, [nombre, userId]); // Dependencia añadida para userId

    const handleFavoriteClick = async () => {
        if (!id || userId === null) {
            console.error('ID no disponible o userId no definido, no se puede cambiar el favorito');
            return;
        }

        try {
            const storedFavorite = localStorage.getItem('favorites');
            const favorites = storedFavorite ? JSON.parse(storedFavorite) : {};

            if (isFavorite) {
                // Cambiar el estado inmediatamente
                setIsFavorite(false);
                delete favorites[id];
                localStorage.setItem('favorites', JSON.stringify(favorites));
                await axios.delete(`http://localhost:3000/api/favoritos/Borrar/${userId}/${id}`);
            } else {
                // Cambiar el estado inmediatamente
                setIsFavorite(true);
                favorites[id] = true;
                localStorage.setItem('favorites', JSON.stringify(favorites));
                await axios.post(`http://localhost:3000/api/favoritos/Insertar/${userId}/${id}`);
            }

            // Emitir evento para notificar a otros componentes
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
        } catch (error) {
            console.error(`No se pudo actualizar el favorito: ${error}`);
            // Revertir el cambio en caso de error
            setIsFavorite(prevState => !prevState);
            const storedFavorite = localStorage.getItem('favorites');
            const favorites = storedFavorite ? JSON.parse(storedFavorite) : {};
            favorites[id] = !isFavorite;
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    };

    useEffect(() => {
        const handleFavoritesUpdated = (event) => {
            const updatedFavorites = event.detail;
            setIsFavorite(updatedFavorites[id] || false);
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdated);

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
        };
    }, [id]);

    const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };
    return (
        <div>
            <Image 
              className={styles.bookmarkIcon} 
              src={isFavorite ? bookmarked : bookmark} 
              alt="bookmark" 
              width={20} 
              height={20} 
              onClick={handleFavoriteClick}
              style={{ cursor: id ? 'pointer' : 'not-allowed' }} 
            />
        </div>
    );
};

export default Bookmark;
