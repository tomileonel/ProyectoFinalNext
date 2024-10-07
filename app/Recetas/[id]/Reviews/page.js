'use client';
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import styles from './page.module.css';
import { Utensils, Edit, Trash2 } from 'lucide-react';

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
  const handleDeleteComment = async (comment) => {
    try {
      const response = await fetch(`http://localhost:3000/api/recetas/deleteComment/${comment}/${userProfile.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });

      if (response.ok) {
        setComentarios(prevComentarios => prevComentarios.filter(c => c.id !== comment.id));
      } else {
        console.error('Error al borrar el comentario');
      }
    } catch (error) {
      console.error('Error en la solicitud de borrado:', error);
    }
  };

  const handleUpdateComment = async (comment, newText) => {
    console.log(newText);
    
    try {
        const response = await fetch(`http://localhost:3000/api/recetas/updateComment/${comment}/${userProfile.id}`, { // Asegúrate de usar comment.comentario aquí
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ msg: newText }),
        });

        if (response.ok) {
            // Actualiza el estado de comentarios sin necesidad de refrescar la página
            setComentarios(prevComentarios => 
                prevComentarios.map(c => 
                    c.comentario === comment.comentario ? { ...c, comentario: newText } : c
                )
            );
        } else {
            console.error('Error al actualizar el comentario');
        }
    } catch (error) {
        console.error('Error en la solicitud de actualización:', error);
    }
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
            <ComentarioIndividual 
              key={comentario.id} 
              comentario={comentario}
              idComentario = {comentario.id[0]} 
              usuario={userProfile} 
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
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

const ComentarioIndividual = ({ comentario, usuario, idComentario, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comentario.comentario);
  const [comentarioId, setComentarioId] = useState(null);

  useEffect(() => {
    const fetchIdComentario = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/recetas/getCommentIdByText/${comentario.comentario}`, {
            method: 'GET',
          });

          if (response.ok) {
            const data = await response.json();
            setComentarioId(data);
            
          } else {
            console.error('Error al obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        }
    fetchIdComentario();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    
  };

  const handleSave = () => {
    onUpdate(comentario.comentario, editedText);
    setIsEditing(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setEditedText(comentario.comentario);
    setIsEditing(false);
  };
  const handleDelete = (comentario) => {
    onDelete(comentario);
    window.location.reload();
  };
console.log("datos comentario", comentario)
console.log(comentarioId, )

  return (
    <div className={styles.comment}>
      <img src={comentario.imagen} alt="avatar" className={styles.avatar} />
      <div className={styles.commentContent}>
        <h3>{comentario.nombreusuario}</h3>
        <p className={styles.fecha}>{comentario.fecha}</p>
        {isEditing ? (
          <div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={styles.editTextarea}
            />
            <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
            <button onClick={handleCancel} className={styles.cancelButton}>Cancelar</button>
          </div>
        ) : (
          <p>{comentario.comentario}</p>
        )}
      </div>
      {usuario && usuario.nombreusuario === comentario.nombreusuario  && !isEditing && (
        <div className={styles.commentActions}>
          <button onClick={handleEdit} className={styles.button}>
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(comentario.comentario)} className={styles.button}>
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};





