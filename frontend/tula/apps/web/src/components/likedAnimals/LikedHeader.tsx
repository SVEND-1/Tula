interface Props {
    navigate: (path: string) => void;
    setActiveTab: (tab: any) => void;
    profile: any;
}

const LikedHeader: React.FC<Props> = ({ navigate, setActiveTab, profile }) => (
    <header className="liked-header">
        <button onClick={() => navigate('/main')} className="back-btn">← Назад</button>
        <div className="logo">Adoptly</div>
        <div className="profile-avatar-small" onClick={() => setActiveTab('profile')}>
            {profile?.name?.charAt(0) || '👤'}
        </div>
    </header>
);

export default LikedHeader;