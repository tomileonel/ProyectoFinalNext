import Image from 'next/image';
import { useEffect, useState } from 'react';
//import styles from './ProfileHeader.module.css'; // Asegúrate de tener un archivo CSS módulo para los estilos

const ProfileHeader = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          console.log(`Fetching user data for ID: ${userId}`); // Imprime el userId
          const response = await fetch(`http://localhost:3000/api/user/${userId}`);
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
          const data = await response.json();
          console.log('User data fetched:', data); // Imprime los datos del usuario
          setUser(data);
        } catch (error) {
          setError(error.message);
        }
      };

    fetchUserData();
  }, [userId]);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <h2>Perfil</h2>
        <div className={styles.profileImage}>
          <Image src={user.image} alt="Profile image" width={100} height={100} />
        </div>
        <p className={styles.profileName}>{user.name}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
