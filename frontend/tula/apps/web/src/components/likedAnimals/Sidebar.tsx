const tabs = [
    { tab: 'profile', icon: '👤', label: 'Главная' },
    { tab: 'mypets', icon: '🐕', label: 'Мои питомцы' },
    { tab: 'reviews', icon: '⭐', label: 'Отзывы' },
    { tab: 'liked', icon: '❤️', label: 'Понравившиеся' },
    { tab: 'createShelter', icon: '🏠', label: 'Приют' },
] as const;

interface Props {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    profile: any;
    navigate: (path: string) => void;
}

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, profile, navigate }) => (
    <aside className="sidebar">
        <div className="user-info-sidebar">
            <div className="user-avatar">{profile?.name?.charAt(0) || '👤'}</div>
            <h3>{profile?.name || 'Пользователь'}</h3>
            <p>{profile?.email}</p>
        </div>

        <nav className="sidebar-nav">
            {tabs.map(({ tab, icon, label }) => (
                <button
                    key={tab}
                    className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    <span className="nav-icon">{icon}</span> {label}
                </button>
            ))}

            <button className="nav-item" onClick={() => navigate('/chat')}>
                <span className="nav-icon">💬</span> Чат
            </button>
        </nav>
    </aside>
);

export default Sidebar;