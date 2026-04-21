interface Props {
    ownerName?: string;
    createdAt: string;
    formatDate: (date: string) => string;
}

const AnimalOwner: React.FC<Props> = ({ ownerName, createdAt, formatDate }) => (
    <div className="owner-info">
        <div className="owner-item">
            <span className="owner-label">👤 Хозяин</span>
            <span className="owner-value">{ownerName || 'Не указан'}</span>
        </div>
        <div className="owner-item">
            <span className="owner-label">📅 Добавлен</span>
            <span className="owner-value">{formatDate(createdAt)}</span>
        </div>
    </div>
);

export default AnimalOwner;