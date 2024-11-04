import { useState } from 'react';
import styles from './styles.module.css';

const Counter = ({ itemCount, setItemCount }) => {
  const increment = () => setItemCount(itemCount + 1);
  const decrement = () => setItemCount(itemCount > 0 ? itemCount - 1 : 0);

  return (
    <div className={styles.counterContainer}>
      <button onClick={decrement} className={styles.counterButton}>-</button>
      <span className={styles.counterValue}>{itemCount}</span>
      <button onClick={increment} className={styles.counterButton}>+</button>
    </div>
  );
};

export default Counter;