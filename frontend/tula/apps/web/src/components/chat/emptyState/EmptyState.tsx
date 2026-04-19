import React from 'react';
import styles from './EmptyState.module.css';

// Показывается на десктопе, когда пользователь ещё не выбрал чат
const EmptyState: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🐾</span>
      <p className={styles.title}>Выберите чат</p>
      <p className={styles.subtitle}>Свайпните питомца вправо, чтобы начать общение</p>
    </div>
  );
};

export default EmptyState;
