import { FACTS } from '../../../pages/liked/useLikedAnimals.ts';

const ProfileTab = ({ profile, uniqueLikedAnimals, myAnimals, currentFact, navigate }: any) => (
    <div className="profile-main">
        <div className="welcome-card">
            <h1>Добро пожаловать, {profile?.name || 'Пользователь'}!</h1>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-number">{uniqueLikedAnimals.length}</div>
                <div className="stat-label">Понравилось животных</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{myAnimals.length}</div>
                <div className="stat-label">Моих питомцев</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">{profile?.myReview?.length || 0}</div>
                <div className="stat-label">Моих отзывов</div>
            </div>
        </div>

        <div className="fact-card">
            <div>{FACTS[currentFact].emoji}</div>
            <p>{FACTS[currentFact].text}</p>
        </div>

        <div className="action-buttons">
            <button onClick={() => navigate('/payments')}>💳 История платежей</button>
            <button onClick={() => navigate('/subscription')}>⭐ Подписка</button>
        </div>
    </div>
);

export default ProfileTab;