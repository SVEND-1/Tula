import React from 'react';
import styles from './EmptyChat.module.css';

// Заглушка когда ни один чат не выбран (видна только на десктопе)
const EmptyChat: React.FC = () => (
  <div className={styles.empty}>
    <div className={styles.icon}>🐾</div>
    <p className={styles.title}>Выберите чат</p>
    <p className={styles.sub}>Свайпните питомца вправо, чтобы начать общение</p>
  </div>
);

export default EmptyChat;
