import React from 'react';
import type { PetChat } from '../../../types/chat/chat.types.ts';
import ChatHeader from '../chatHeader/ChatHeader.tsx';
import MessageList from '../messageList/MessageList.tsx';
import ChatInput from '../chatInput/ChatInput.tsx';
import styles from './ChatWindow.module.css';

interface Props {
  pet: PetChat;
  isTyping: boolean;
  onSend: (text: string) => void;
  onBack: () => void;
}

// Весь правый блок: шапка питомца + сообщения + ввод
const ChatWindow: React.FC<Props> = ({ pet, isTyping, onSend, onBack }) => (
  <div className={styles.window}>
    <ChatHeader pet={pet} onBack={onBack} />
    <MessageList messages={pet.messages} petEmoji={pet.emoji} isTyping={isTyping} />
    <ChatInput onSend={onSend} />
  </div>
);

export default ChatWindow;
