
import React from 'react';
import styles from './styles.module.css';
import CardRecipe from '../CardRecipe';
import img1 from '../../img/bookmark.png';
import img2 from '../../img/cesarSalad.png';

const HomeRecipesCarousel = () => {
  const recipes = [
    {
      ensaladaCsar: 'Ensalada César',
      image: img2,
      prop: '⭐4.5',
      mins: '50 Mins',
      prop1: '2500$',
      kcal: '1500 Kcal',
    },
    {
      ensaladaCsar: 'Ensañada terishaki',
      image: img2,
      prop: '⭐5.0',
      mins: '10 Mins',
      prop1: '1750$',
      kcal: '750 Kcal',
    },
    {
      ensaladaCsar: 'Ensañada terishaki',
      image: img2,
      prop: '⭐5.0',
      mins: '10 Mins',
      prop1: '1750$',
      kcal: '750 Kcal',
    },
    {
      ensaladaCsar: 'Ensañada terishaki',
      image: img2,
      prop: '⭐5.0',
      mins: '10 Mins',
      prop1: '1750$',
      kcal: '750 Kcal',
    },
    {
      ensaladaCsar: 'Ensañada terishaki',
      image: img2,
      prop: '⭐5.0',
      mins: '10 Mins',
      prop1: '1750$',
      kcal: '750 Kcal',
    },
  ];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div className={styles.cards}>
          {recipes.map((recipe, index) => (
            <CardRecipe key={index} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeRecipesCarousel;
