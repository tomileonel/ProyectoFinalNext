'use client';
import { useState,useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [comentarios, setComentarios] = useState(null);
  const handleGoBack = () => {
    window.history.back();
  };
  const agregarComentario = (nuevoComentario) => {
    setComentarios([...comentarios, nuevoComentario]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
      <h1 onClick={handleGoBack} style={{ cursor: 'pointer' }}>←</h1>
        <h1 className={styles.title}>Reseñas</h1>
        <div className={styles.counterSection}>
          <span> Comentarios</span>
          <span> Guardados</span>
        </div>
      </header>
      
      <div className={styles.commentSection}>
        <h2>Deja un comentario</h2>
        <FormularioComentario agregarComentario={agregarComentario} />
        
        <div className={styles.commentList}>
            {comentarios && comentarios.length > 0 ? (
                comentarios.map((comentario) => (
            <ComentarioIndividual key={comentario.id} comentario={comentario} />
                ))
        ) : (
            <p>Aun no hay comentarios</p>
         )}
        </div>
      </div>
    </div>
  );
}

const FormularioComentario = ({ agregarComentario }) => {
  const [textoComentario, setTextoComentario] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (textoComentario.trim() !== '') {
      const nuevoComentario = {
        id: Date.now(),
        nombre: 'Usuario Anónimo',
        fecha: new Date().toLocaleDateString(),
        mensaje: textoComentario,
        likes: 0,
        dislikes: 0,
        avatar: 'https://i.pravatar.cc/50',
      };
      agregarComentario(nuevoComentario);
      setTextoComentario('');
    }
  };

  return (
    <form onSubmit={manejarEnvio} className={styles.form}>
      <input
        type="text"
        placeholder="Di algo..."
        value={textoComentario}
        onChange={(e) => setTextoComentario(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>Enviar</button>
    </form>
  );
};

const ComentarioIndividual = ({ comentario }) => {
  const [likes, setLikes] = useState(comentario.likes);
  const [dislikes, setDislikes] = useState(comentario.dislikes);

  const darLike = () => setLikes(likes + 1);
  const darDislike = () => setDislikes(dislikes + 1);

  return (
    <div className={styles.comment}>
      <img src={comentario.avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.commentContent}>
        <h3>{comentario.nombre}</h3>
        <p className={styles.fecha}>{comentario.fecha}</p>
        <p>{comentario.mensaje}</p>
        <div className={styles.actions}>
          <button onClick={darLike} className={styles.likeButton}>👍 {likes}</button>
          <button onClick={darDislike} className={styles.dislikeButton}>👎 {dislikes}</button>
        </div>
      </div>
    </div>
  );
};
