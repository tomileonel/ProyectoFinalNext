import Image from 'next/image';
import styles from './styles.module.css';
import pfp from '../../img/pfp.png'
const ProfileHeader = ({ user }) => {
  const profilepic = user.imagen == null ? pfp : user.imagen;
  return (
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <h2>Perfil</h2>
        <div className={styles.profileImage}>
          <Image
            src={user.imagen || profilepic}
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
