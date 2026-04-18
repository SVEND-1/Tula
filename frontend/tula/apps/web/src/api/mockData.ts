import type {PetChat} from '../types/chat/chat.types.ts';

// Заглушка - потом заменить на запросы к API
export const MOCK_CHATS: PetChat[] = [
  {
    id: 1,
    name: 'Барни',
    breed: 'Золотистый ретривер',
    emoji: '🐶',
    preview: '',
    time: '14:32',
    unread: 1,
    messages: [
        { id: '1-1', from: 'out',  text: 'Сообщение1', time: '14:20' },
        { id: '1-2', from: 'in', text: 'Сообщение2', time: '14:22' },
        { id: '1-3', from: 'in', text: 'ывоалыо', time: '14:24'},
    ],
  },
  {
    id: 2,
    name: 'Луна',
    breed: 'Британская короткошёрстная',
    emoji: '🐱',
    preview: '',
    time: '13:10',
    unread: 0,
    messages: [
        { id: '2-1', from: 'out',  text: 'Сообщение1', time: '14:20' },
        { id: '2-2', from: 'in', text: 'Сообщение2', time: '14:22' },
    ],
  },
  {
    id: 3,
    name: 'Рыжик',
    breed: 'Карликовый кролик',
    emoji: '🐇',
    preview: '',
    time: '11:45',
    unread: 0,
    messages: [
        { id: '3-1', from: 'out',  text: 'Сообщение1', time: '14:20' },
        { id: '3-2', from: 'in', text: 'Сообщение2', time: '14:22' },
    ],
  },
  {
    id: 4,
    name: 'Мейсон',
    breed: 'Бигль',
    emoji: '🐶',
    preview: '',
    time: 'вчера',
    unread: 0,
    messages: [
        { id: '4-1', from: 'out',  text: 'Сообщение1', time: '14:20' },
        { id: '4-2', from: 'in', text: 'Сообщение2', time: '14:22' },
    ],
  },
];
