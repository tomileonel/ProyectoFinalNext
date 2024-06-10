import React from 'react';
import styles from './styles.module.css';
import CardRecipe from './CardRecipe';

const recipes = [
  {
    ensaladaCsar: 'Ensalada César',
    image: '/path/to/cesar-image.jpg',
    prop: '4.5',
    mins: '50 Mins',
    prop1: '2500$',
    kcal: '1500 Kcal'
  },
  // Agrega más recetas según sea necesario
];

const Index = () => {
  return (
    <div>
      <h1>Recetas</h1>
      <div className={styles.carousel}>
        {recipes.map((recipe, index) => (
          <CardRecipe
            key={index}
            ensaladaCsar={recipe.ensaladaCsar}
            image={recipe.image}
            prop={recipe.prop}
            mins={recipe.mins}
            prop1={recipe.prop1}
            kcal={recipe.kcal}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
