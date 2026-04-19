import React from 'react';
import type { Message } from '../../../types/chat/chat.types.ts';
import styles from './MessageBubble.module.css';

interface Props {
  message: Message;
  petEmoji: string;
}

const MessageBubble: React.FC<Props> = ({ message, petEmoji }) => {
  const isIncoming = message.from === 'in';

  return (
    <div className={`${styles.row} ${isIncoming ? styles.in : styles.out}`}>
      {isIncoming && <div className={styles.avatar}>{petEmoji}</div>}

      <div className={`${styles.bubble} ${isIncoming ? styles.bubbleIn : styles.bubbleOut}`}>
        {message.text}
        <span className={styles.time}>{message.time}</span>
      </div>

      {!isIncoming && <div className={`${styles.avatar} ${styles.userAvatar}`}>А</div>}
    </div>
  );
};

export default MessageBubble;
