import Image from 'next/image';
import styles from './styles.module.css';

const ProfileHeader = ({ user }) => {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <h2>Perfil</h2>
        <div className={styles.profileImage}>
          <Image
            src={user.imagen || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tyEA8rRXZabfLf_AwxDy-vQ91ecjMJjxVw&s'}
            alt="Profile image"
            width={100}
            height={100}
          />
        </div>
        <p className={styles.profileName}>{user.nombre}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
