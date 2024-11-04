"use client";
import { useState, useEffect } from 'react';
import TagSelector from '../components/TagSelector/'; // Importa tu componente TagSelector
import styles from './page.module.css';

const EditProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombreusuario: '',
    contrasena: '',
    mail: '',
    nombre: '',
    apellido: '',
    telefono: '',
    descripcion: '',
    imagen: '',
    tags: []
  });
  

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
            console.log(data)
            setFormData({
              nombreusuario: data.nombreusuario || '',
              contrasena: '',
              mail: data.mail || '',
              nombre: data.nombre || '',
              apellido: data.apellido || '',
              telefono: data.telefono || '',
              descripcion: data.descripcion || '',
              imagen: data.imagen || '',
              tags: data.tags || []
            });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleTagsChange = (tags) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = {
          idusuario: userProfile.id,  
          nombreusuario: formData.nombreusuario,
          mail: formData.mail,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          descripcion: formData.descripcion,
          imagen: formData.imagen,
          tags: formData.tags,
        };
  
        if (formData.contrasena) {
          userData.contrasena = formData.contrasena;
        }
  
        const response = await fetch('http://localhost:3000/api/auth/updateUserProfile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (response.ok) {
          console.log('Perfil actualizado con éxito');
        } else {
          console.error('Error al actualizar el perfil', await response.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };
  
  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>Editar Perfil</h2>
        <div className={styles.field}>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="nombreusuario"
            value={formData.nombreusuario}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        
        <div className={styles.field}>
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
        <label>Imagen:</label>
          <input 
            type="file" 
            accept="image/*"  
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.field}>
          <label>Etiquetas</label>
          <TagSelector onTagsChange={handleTagsChange} />
        </div>

        <button  onClick={handleSubmit} className={styles.saveButton}>Guardar Cambios</button>
    </div>
  );
};

export default EditProfile;
