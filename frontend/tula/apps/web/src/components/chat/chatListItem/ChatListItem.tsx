import React from 'react';
import type { PetChat } from '../../../types/chat/chat.types.ts';
import styles from './ChatListItem.module.css';

interface Props {
  chat: PetChat;
  isActive: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<Props> = ({ chat, isActive, onClick }) => (
  <div
    className={`${styles.item} ${isActive ? styles.active : ''}`}
    onClick={onClick}
  >
    <div className={styles.avatar}>{chat.emoji}</div>

    <div className={styles.meta}>
      <span className={styles.name}>{chat.name}</span>
      <span className={styles.preview}>{chat.preview}</span>
    </div>

    <div className={styles.right}>
      <span className={styles.time}>{chat.time}</span>
      {chat.unread > 0 && (
        <span className={styles.badge}>{chat.unread}</span>
      )}
    </div>
  </div>
);

export default ChatListItem;
