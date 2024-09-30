'use client';
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import styles from './page.module.css';
import { Utensils } from 'lucide-react';

export default function Review() {
  const [comentarios, setComentarios] = useState([]);
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/getUserProfile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Token no encontrado');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
 
  useEffect(() => {
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/recetas/getReviews/${id}`);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Fetched data:', data);
    
            if (data && typeof data === 'object') {
                console.log('Data type:', typeof data);
                console.log('Data keys:', Object.keys(data));
    
                let comments;
                if (Array.isArray(data.recordsets) && data.recordsets.length > 0) {
                    comments = data.recordsets[0];
                } else if (Array.isArray(data.recordset)) {
                    comments = data.recordset;
                } else {
                    throw new Error(`Unexpected data structure. Cannot find comments array.`);
                }
    
                if (Array.isArray(comments)) {
                    setComentarios(comments);
                } else {
                    throw new Error(`Comments is not an array. Received: ${typeof comments}`);
                }
            } else {
                throw new Error(`Unexpected data format. Received: ${typeof data}`);
            }
            
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComentarios([]);
        }
    };
   fetchComments();
  }, [id])

  const handleGoBack = () => {
    window.history.back();
  };

  const agregarComentario = (nuevoComentario) => {
    setComentarios(prevComentarios => [
      ...prevComentarios,
      {
        ...nuevoComentario,
        total_reviews: (prevComentarios[0]?.total_reviews || 0) + 1
      }
    ]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
      <h1 onClick={handleGoBack} style={{ cursor: 'pointer' }}>←</h1>
        <h1 className={styles.title}>Reseñas</h1>
        <div className={styles.counterSection}>
          <span>{comentarios[0]?.total_reviews || 0} Comentarios</span>
          <span>{comentarios[0]?.total_bookmarked} Guardados</span>
        </div>
      </header>
      
      <div className={styles.commentSection}>
        <h2>Deja un comentario</h2>
        <FormularioComentario agregarComentario={agregarComentario} usuario={userProfile} recipeId={id} />
        
        <div className={styles.commentList}>
  {comentarios.length > 0 ? (
    comentarios.map((comentario) => (
      <ComentarioIndividual key={comentario.id} comentario={comentario} usuario={userProfile} />
    ))
  ) : (
    <p>Aun no hay comentarios</p>
  )}
</div>

      </div>
    </div>
  );
}

const FormularioComentario = ({ agregarComentario, usuario, recipeId }) => {
  const [textoComentario, setTextoComentario] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (textoComentario.trim() !== '') {
      const nuevoComentario = {
        msg: textoComentario, // El mensaje del comentario
        date: new Date().toISOString(), // Fecha en formato ISO estándar
      };

      try {
        const response = await fetch(`http://localhost:3000/api/recetas/postComment/${recipeId}/${usuario.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoComentario), // Enviar el msg y date en el body
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error al enviar el comentario: ${errorData.message || response.statusText}`);
        }

        // Agregar el nuevo comentario localmente si el envío fue exitoso
        agregarComentario({
          id: Date.now(), // Generar un ID temporal
          nombreusuario: usuario.nombreusuario,
          fecha: nuevoComentario.date,
          comentario: nuevoComentario.msg,
          imagen: usuario.imagen,
          likes: 0,
          dislikes: 0,
        });

        // Limpiar el campo de texto
        setTextoComentario('');
      } catch (error) {
        console.error('Error al enviar el comentario:', error);
      }
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

const ComentarioIndividual = ({ comentario, usuario }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    // Obtener la cantidad de likes y dislikes
    const fetchLikeDislikeCounts = async (commentId) => {
      try {
        // Puedes enviar un objeto con el valor de like que necesitas
        const response = await fetch(`http://localhost:3000/api/recetas/countLikes/${commentId}`, {
          method: 'POST', // Asegúrate de usar POST si es necesario para la API
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ like: true }), // Envía el valor like que deseas
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        return data; // Asegúrate de que la respuesta sea un JSON válido
      } catch (error) {
        console.error('Error al obtener los conteos de likes/dislikes:', error);
        return null; // Devuelve null o un valor por defecto
      }
    };
    

    // Verificar el estado actual de like/dislike del usuario
    const fetchUserLikeStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/recetas/getLikes/${comentario.id}/${usuario.id}`);
        const data = await response.json();
        
        if (data) {
          setHasLiked(data.like === true);
          setHasDisliked(data.like === false);
        }
      } catch (error) {
        console.error('Error verificando el estado del like:', error);
      }
    };

    fetchLikeDislikeCounts();
    fetchUserLikeStatus();
  }, [comentario.id, usuario.id]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        // Si ya ha dado like, lo elimina
        await fetch(`http://localhost:3000/api/recetas/deleteLike/${comentario.id}/${usuario.id}`, {
          method: 'DELETE',
        });
        setLikes(likes - 1);
        setHasLiked(false);
      } else {
        // Si no ha dado like, agrega un like
        await fetch(`http://localhost:3000/api/recetas/likeComment/${comentario.id}/${usuario.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ like: true }),
        });
        setLikes(likes + 1);
        if (hasDisliked) {
          setDislikes(dislikes - 1);
          setHasDisliked(false);
        }
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error al procesar el like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      if (hasDisliked) {
        // Si ya ha dado dislike, lo elimina
        await fetch(`http://localhost:3000/api/recetas/deleteLike/${comentario.id}/${usuario.id}`, {
          method: 'DELETE',
        });
        setDislikes(dislikes - 1);
        setHasDisliked(false);
      } else {
        // Si no ha dado dislike, agrega un dislike
        await fetch(`http://localhost:3000/api/recetas/likeComment/${comentario.id}/${usuario.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ like: false }),
        });
        setDislikes(dislikes + 1);
        if (hasLiked) {
          setLikes(likes - 1);
          setHasLiked(false);
        }
        setHasDisliked(true);
      }
    } catch (error) {
      console.error('Error al procesar el dislike:', error);
    }
  };

  return (
    <div className={styles.comment}>
      <img src={comentario.imagen} alt="avatar" className={styles.avatar} />
      <div className={styles.commentContent}>
        <h3>{comentario.nombreusuario}</h3>
        <p className={styles.fecha}>{comentario.fecha}</p>
        <p>{comentario.comentario}</p>
        <div className={styles.actions}>
          <button onClick={handleLike} className={styles.likeButton}>
            👍 {likes} {hasLiked ? '(Tú has dado like)' : ''}
          </button>
          <button onClick={handleDislike} className={styles.dislikeButton}>
            👎 {dislikes} {hasDisliked ? '(Tú has dado dislike)' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

