import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import BookmarkFavorites from '../BookmarkFavoritos';

const CardFavorite = ({ nombre, image, prop, mins, prop1, kcal }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad de la tarjeta

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleFavoritesUpdated = (event) => {
            const { id, isFavorite: updatedIsFavorite } = event.detail;
            if (id) {
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
                setIsFavorite(!!storedFavorites[id]);
            }
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdated);

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
        };
    }, []);

    const handleRemove = (id) => {
        setIsVisible(false); // Oculta la tarjeta cuando el favorito es eliminado
    };

    const imageSize = windowWidth > 600 ? { width: '150px', height: '150px' } : { width: '100px', height: '100px' };

    if (!isVisible) return null; // Si no es visible, no se renderiza la tarjeta

    return (
        <div className={styles.card}>
            <div className={styles.foodPhoto}>
                <img 
                    src={image} 
                    alt={nombre} 
                    className={styles.image} 
                    style={imageSize} 
                />
                <div className={styles.titleButton}>
                    <p className={styles.nombre}>{nombre}</p>
                </div>
            </div>
            <div className={styles.rating}>
                <p className={styles.text}>{prop}</p>
            </div>
            <div className={styles.time}>
                <div className={styles.time1}>
                    <p className={styles.tiempo}>Tiempo</p>
                    <p className={styles.mins}>{mins}</p>
                </div>
                <div className={styles.time2}>
                    <p className={styles.tiempo}>Precio</p>
                    <p className={styles.mins}>{prop1}</p>
                </div>
                <div className={styles.time3}>
                    <p className={styles.tiempo}>Calorías</p>
                    <p className={styles.mins}>{kcal}</p>
                </div>
                <BookmarkFavorites nombre={nombre} onRemove={handleRemove} />
            </div>
        </div>
    );
};

export default CardFavorite;
