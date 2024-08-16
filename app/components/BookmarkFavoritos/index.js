import axios from "axios";
import React, { useEffect, useState } from 'react';
import bookmark from '../../img/bookmark.png';
import bookmarked from '../../img/bookmarked.png';
import Image from 'next/image';
import styles from './styles.module.css';

const BookmarkFavorites = ({ nombre, onRemove }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [id, setId] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const obtenerIdPorNombre = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/recetas/getIdByName/${nombre}`);
                const fetchedId = response.data.recordset?.[0]?.id || null;
                setId(fetchedId);

                if (fetchedId) {
                    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
                    setIsFavorite(!!storedFavorites[fetchedId]);

                    if (!(fetchedId in storedFavorites)) {
                        const favoriteResponse = await axios.get(`http://localhost:3000/api/favoritos/getFavourites/1/${fetchedId}`);
                        const isFavoriteFromDB = favoriteResponse.data.isFavorite;
                        setIsFavorite(isFavoriteFromDB);

                        storedFavorites[fetchedId] = isFavoriteFromDB;
                        localStorage.setItem('favorites', JSON.stringify(storedFavorites));
                    }
                }
            } catch (error) {
                console.error('Error al obtener el ID por nombre:', error);
            }
        };

        obtenerIdPorNombre();
    }, [nombre]);

    const handleFavoriteClick = async () => {
        if (!id) return;

        try {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};

            if (isFavorite) {
                delete storedFavorites[id];
                await axios.delete(`http://localhost:3000/api/favoritos/Borrar/1/${id}`);
                setIsVisible(false); // Oculta el componente visualmente
                if (onRemove) onRemove(id); // Notifica al componente padre si se proporciona un callback
            } else {
                storedFavorites[id] = true;
                await axios.post(`http://localhost:3000/api/favoritos/Insertar/1/${id}`);
            }

            localStorage.setItem('favorites', JSON.stringify(storedFavorites));
            setIsFavorite(!isFavorite);

            window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: storedFavorites }));
        } catch (error) {
            console.error('Error al actualizar el favorito:', error);
        }
    };

    useEffect(() => {
        const handleFavoritesUpdated = (event) => {
            const updatedFavorites = event.detail;
            if (id) setIsFavorite(!!updatedFavorites[id]);
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    }, [id]);

    if (!isVisible) return null;

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

export default BookmarkFavorites;
