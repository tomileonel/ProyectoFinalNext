"use client"
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';
import searchIcon from '../../img/buscarIcon.png';
import cartIcon from '../../img/cestaIcon.png';
import favoritesIcon from '../../img/favoritosIcon.png';
import profileIcon from '../../img/usuarioIcon.png';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState(pathname);

  const handleIconClick = (page) => {
    setSelected(`/${page}`);
    router.push(`/${page}`);
  };

  return (
    <div className={styles.navbar}>
      <div
        className={`${styles.icon} ${selected === '/' ? styles.selected : ''}`}
        onClick={() => handleIconClick('')}
      >
        <Image src={searchIcon} alt="Search" className={styles.iconImage} width={24} height={24} />
        <p className={styles.iconLabel}>Buscar</p>
      </div>
      <div
        className={`${styles.icon} ${selected === '/cart' ? styles.selected : ''}`}
        onClick={() => handleIconClick('cart')}
      >
        <Image src={cartIcon} alt="Cart" className={styles.iconImage} width={24} height={24} />
        <p className={styles.iconLabel}>Cesta</p>
      </div>
      <div
        className={`${styles.icon} ${selected === '/favorites' ? styles.selected : ''}`}
        onClick={() => handleIconClick('favorites')}
      >
        <Image src={favoritesIcon} alt="Favorites" className={styles.iconImage} width={24} height={24} />
        <p className={styles.iconLabel}>Favoritos</p>
      </div>
      <div
        className={`${styles.icon} ${selected === '/profile' ? styles.selected : ''}`}
        onClick={() => handleIconClick('profile')}
      >
        <Image src={profileIcon} alt="Profile" className={styles.iconImage} width={24} height={24} />
        <p className={styles.iconLabel}>Perfil</p>
      </div>
    </div>
  );
};

export default Navbar;
