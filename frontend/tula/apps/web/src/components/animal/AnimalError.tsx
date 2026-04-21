interface Props {
    navigate: (path: string) => void;
}

const AnimalError: React.FC<Props> = ({ navigate }) => (
    <div className="error-container">
        <h2>Животное не найдено</h2>
        <button onClick={() => navigate('/main')} className="back-btn">
            ← Вернуться
        </button>
    </div>
);

export default AnimalError;