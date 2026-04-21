interface Props {
    image: string | null;
    name: string;
    typeIcon: string;
}

const AnimalImage: React.FC<Props> = ({ image, name, typeIcon }) => (
    <div className="animal-image-section">
        {image ? (
            <img src={image} alt={name} className="main-image" />
        ) : (
            <div className="image-placeholder">
                <span className="animal-emoji">{typeIcon}</span>
            </div>
        )}
    </div>
);

export default AnimalImage;