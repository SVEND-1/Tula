const LikedTab = ({ uniqueLikedAnimals, navigate }: any) => (
    <div className="liked-main">
        {uniqueLikedAnimals.length === 0 ? (
            <button onClick={() => navigate('/main')}>
                Перейти к животным
            </button>
        ) : (
            uniqueLikedAnimals.map((a: any) => (
                <div key={a.id}>{a.name}</div>
            ))
        )}
    </div>
);

export default LikedTab;