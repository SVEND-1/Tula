
import { createAnimal } from '../../api/animalApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types.ts';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/AdminAnimals.css';
import {useState} from "react";

export default function AdminAnimals() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAnimal = async (data: CreateAnimalRequest) => {
        setIsLoading(true);
        try {
            console.log(' Отправляем данные:', data);

            const response = await createAnimal(data);

            console.log(' Ответ сервера:', response.data);

            if (response.data) {
                alert(` Животное "${response.data.name}" успешно создано!`);
            }
        } catch (error: any) {
            console.error(' Ошибка:', error);
            console.error(' Ответ сервера:', error.response?.data);

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