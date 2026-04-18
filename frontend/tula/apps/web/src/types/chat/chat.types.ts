// Одно сообщение в чате
export interface Message {
  id: string;
  from: 'in' | 'out'; // 'in' = питомец, 'out' = пользователь
  text: string;
  time: string;
}

// Питомец / чат с питомцем
export interface PetChat {
  id: number;
  name: string;
  breed: string;
  emoji: string;
  preview: string;   // последнее сообщение (для списка)
  time: string;
  unread: number;
  messages: Message[];
}
