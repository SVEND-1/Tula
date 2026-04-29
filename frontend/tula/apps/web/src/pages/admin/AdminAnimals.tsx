import { createAnimalWithImage, getAnimalImageUrl } from '../../api/animalApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types.ts';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/AdminAnimals.scss';
import { useState } from "react";

export default function AdminAnimals() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageFile?: File) => {
        setIsLoading(true);
        try {
            console.log('=== ОТПРАВКА ДАННЫХ ===');
            console.log('Данные животного:', data);
            console.log('Файл картинки:', imageFile?.name);

            const response = await createAnimalWithImage(data, imageFile);

            console.log('=== ОТВЕТ СЕРВЕРА ===');
            console.log('Статус:', response.status);
            console.log('Данные:', response.data);

            if (response.data && response.data.id) {
                if (imageFile) {
                    const imageUrl = await getAnimalImageUrl(response.data.id);
                    if (imageUrl) {
                        const existingAnimals = localStorage.getItem('animalImages');
                        const images = existingAnimals ? JSON.parse(existingAnimals) : {};
                        images[response.data.id] = imageUrl;
                        localStorage.setItem('animalImages', JSON.stringify(images));
                    }
                }
                alert(` Животное "${response.data.name}" успешно создано!`);
            }
        } catch (error: any) {
            console.error('Ошибка:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка создания анкеты';
            alert(` ${errorMessage}`);
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