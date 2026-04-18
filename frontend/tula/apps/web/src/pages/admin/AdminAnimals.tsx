import { createAnimal } from '../../api/animalApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types.ts';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/AdminAnimals.css';
import { useState } from "react";

export default function AdminAnimals() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageBase64?: string) => {
        setIsLoading(true);
        try {
            const response = await createAnimal(data);

            if (response.data) {
                const uniqueKey = `${response.data.name}_${response.data.breed}_${response.data.age}`;

                const existingAnimals = localStorage.getItem('animalImages');
                const images = existingAnimals ? JSON.parse(existingAnimals) : {};
                images[uniqueKey] = imageBase64 || '';
                localStorage.setItem('animalImages', JSON.stringify(images));

                const animalData = localStorage.getItem('animalData');
                const animals = animalData ? JSON.parse(animalData) : {};
                animals[uniqueKey] = response.data;
                localStorage.setItem('animalData', JSON.stringify(animals));

                console.log('Уникальный ключ:', uniqueKey);
                console.log('Сохранённые фото:', images);

                alert(` Животное "${response.data.name}" успешно создано!`);
            }
        } catch (error: any) {
            console.error('Ошибка:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка создания анкеты';
            alert(`❌ ${errorMessage}`);
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