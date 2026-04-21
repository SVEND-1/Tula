import {useState} from "react";
import { createAnimal } from '../../api/animalApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/AdminAnimals.scss';

export default function AdminAnimals() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageBase64?: string) => {
        setIsLoading(true);
        try {
            const res = await createAnimal(data);

            if (res.data) {
                // Сохраняем картинку в localStorage по id животного
                const stored = localStorage.getItem('animalImages');
                const images = stored ? JSON.parse(stored) : {};
                images[res.data.id] = imageBase64 || '';
                localStorage.setItem('animalImages', JSON.stringify(images));

                alert(`✅ Животное "${res.data.name}" успешно создано!`);
            }
        } catch (error: any) {
            console.error('Ошибка создания животного:', error);
            alert(`❌ ${error.response?.data?.message || 'Ошибка создания анкеты'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <CreateAnimalForm onSubmit={handleCreateAnimal} isLoading={isLoading} />
            </div>
        </div>
    );
}
