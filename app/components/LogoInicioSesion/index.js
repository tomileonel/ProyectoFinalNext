import Image from 'next/image';
import logo from '../../img/logo.png'; 
import styles from './styles.module.css'; 

const Logo = () => (
  <div className={styles.logo}>
    <Image src={logo} alt="Pocket Chef" width={400} height={400} />
    <h1 className={styles.title}>Conviértete En Tu Propio Chef</h1>
    <p className={styles.description}>
      Explora un extenso catálogo de recetas basándote en tu interés y objetivos
    </p>
  </div>
);

export default Logo;
