import axios from "axios";
import React, { useEffect, useState } from 'react';

const DisplayFavorites = () => {
    const [recipes, setRecipes] = useState([]);
  
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/favoritos/getAll/1'); //si cambiamos el 1 por id usuario cuando hagamos un login deberia funcionar
          setRecipes(response.data);  
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      };
  
      fetchRecipes();
    }, []);
  
      return (
        <div className={styles.main}>
       <p className={styles.title}>Tus favoritos:</p>
       </div>
      );
    };
    
    export default DisplayFavorites;