import Image from 'next/image';
import styles from './styles.module.css';

import { useEffect, useState } from 'react';
//import styles from './ProfileHeader.module.css'; // Asegúrate de tener un archivo CSS módulo para los estilos

const ProfileHeader = ({ user }) => {
  const [error, setError] = useState(null);

  

  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <h2>Perfil</h2>
        <div className={styles.profileImage}>
          <Image src={user.image} alt="Profile image" width={100} height={100} />
        </div>
        <p className={styles.profileName}>{user.nombre}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
