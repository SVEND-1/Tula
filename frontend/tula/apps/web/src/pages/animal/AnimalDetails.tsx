import { useAnimalDetails } from './useAnimalDetails';
import AnimalHeader from '../../components/animal/AnimalHeader';
import AnimalImage from '../../components/animal/AnimalImage';
import AnimalInfo from '../../components/animal/AnimalInfo';
import AnimalLoading from '../../components/animal/AnimalLoading';
import AnimalError from '../../components/animal/AnimalError';
import '../../style/AnimalDetails.scss';

export default function AnimalDetails() {
    const {
        animal,
        isLoading,
        navigate,
        getAnimalImage,
        getAgeText,
        getGenderIcon,
        getGenderText,
        getTypeText,
        getTypeIcon,
        formatDate,
    } = useAnimalDetails();

    if (isLoading) return <AnimalLoading />;
    if (!animal) return <AnimalError navigate={navigate} />;

    const image = getAnimalImage(animal);

    return (
        <>
            <AnimalHeader navigate={navigate} />

            <main className="animal-details-container">
                <div className="animal-card-details">
                    <AnimalImage
                        image={image}
                        name={animal.name}
                        typeIcon={getTypeIcon(animal.animalType)}
                    />

                    <AnimalInfo
                        animal={animal}
                        getAgeText={getAgeText}
                        getGenderIcon={getGenderIcon}
                        getGenderText={getGenderText}
                        getTypeText={getTypeText}
                        formatDate={formatDate}
                        navigate={navigate}
                    />
                </div>
            </main>
        </>
    );
}