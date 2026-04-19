import React from 'react';
import styles from './TypingIndicator.module.css';

interface Props {
  petEmoji: string;
}

// Анимированный индикатор "питомец печатает..."
const TypingIndicator: React.FC<Props> = ({ petEmoji }) => (
  <div className={styles.row}>
    <div className={styles.avatar}>{petEmoji}</div>
    <div className={styles.bubble}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  </div>
);

export default TypingIndicator;
