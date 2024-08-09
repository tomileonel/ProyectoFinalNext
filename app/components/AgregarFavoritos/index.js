import axios from "axios";
import React, { useEffect, useState } from 'react';
import bookmark from '../../img/bookmark.png';
import bookmarked from '../../img/bookmarked.png';
import Image from 'next/image';
import styles from './styles.module.css';

const Bookmark = ({ nombre }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [id, setId] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                    try {
                        const response = await axios.get(`http://localhost:3000/api/favoritos/getFavourites/1/${fetchedId}`);
                        const isFavorite = response.data.isFavorite;
                        setIsFavorite(isFavorite);
                        favorites[fetchedId] = isFavorite;
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                    } catch (error) {
                        console.error('No se pudo verificar el favorito:', error);
                    }
                }
            }
        };

        inicializarFavorito();
    }, [nombre]);

    const handleFavoriteClick = async () => {
        if (!id) {
            console.error('ID no disponible, no se puede cambiar el favorito');
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
                await axios.delete(`http://localhost:3000/api/favoritos/Borrar/1/${id}`);
            } else {
                // Cambiar el estado inmediatamente
                setIsFavorite(true);
                favorites[id] = true;
                localStorage.setItem('favorites', JSON.stringify(favorites));
                await axios.post(`http://localhost:3000/api/favoritos/Insertar/1/${id}`);
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
