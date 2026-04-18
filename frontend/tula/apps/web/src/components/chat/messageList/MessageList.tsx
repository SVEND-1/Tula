import React, { useEffect, useRef } from 'react';
import type { Message } from '../../../types/chat/chat.types.ts';
import MessageBubble from '../messageBubble/MessageBubble.tsx';
import TypingIndicator from '../typingIndicator/TypingIndicator.tsx';
import styles from './MessageList.module.css';

interface Props {
  messages: Message[];
  petEmoji: string;
  isTyping: boolean;
}

const MessageList: React.FC<Props> = ({ messages, petEmoji, isTyping }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новом сообщении или начале печатания
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.area}>
      <div className={styles.dateDivider}>Сегодня</div>

      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} petEmoji={petEmoji} />
      ))}

      {isTyping && <TypingIndicator petEmoji={petEmoji} />}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
