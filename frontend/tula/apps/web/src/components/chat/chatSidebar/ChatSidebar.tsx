import React from 'react';
import type { PetChat } from '../../../types/chat/chat.types.ts';
import ChatListItem from '../chatListItem/ChatListItem.tsx';
import styles from './ChatSidebar.module.css';
import searchIcon from '../../../assets/chat/search.svg'

interface Props {
  chats: PetChat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
}

const ChatSidebar: React.FC<Props> = ({ chats, activeChatId, onSelectChat }) => {
  const [search, setSearch] = React.useState('');

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      {/* Поиск по чатам */}
      <div className={styles.searchWrap}>
          <img src={searchIcon} alt="search" className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск чатов..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <p className={styles.sectionTitle}>Совпадения</p>

      <div className={styles.list}>
        {filtered.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;
