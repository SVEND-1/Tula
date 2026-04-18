
import React, { useState } from 'react';
import type { Gender, AnimalType, CreateAnimalRequest } from '../../types/animal/animal.types.ts';

interface CreateAnimalFormProps {
    onSubmit: (data: CreateAnimalRequest) => Promise<void>;
    isLoading: boolean;
}

export default function CreateAnimalForm({ onSubmit, isLoading }: CreateAnimalFormProps) {
    const [form, setForm] = useState<CreateAnimalRequest>({
        name: '',
        age: 0,
        description: '',
        breed: '',
        gender: 'MAN',
        animalType: 'DOG',
    });

    const isFormValid = form.name.trim() && form.age > 0 && form.breed.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);

        // Сброс формы
        setForm({
            name: '',
            age: 0,
            description: '',
            breed: '',
            gender: 'MAN',
            animalType: 'DOG',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="create-animal-form">
            <h2>➕ Создать анкету животного</h2>

            <div className="form-group">
                <label>🐕 Имя животного *</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Например: Бобик, Мурка"
                    required
                />
            </div>

            <div className="form-group">
                <label>📅 Возраст (лет) *</label>
                <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    required
                />
            </div>

            <div className="form-group">
                <label>🐾 Порода *</label>
                <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    placeholder="Например: Лабрадор, Персидская"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>⚥ Пол</label>
                    <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                    >
                        <option value="MAN">Мальчик</option>
                        <option value="WOMAN">Девочка</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>🐶 Тип животного</label>
                    <select
                        value={form.animalType}
                        onChange={(e) => setForm({ ...form, animalType: e.target.value as AnimalType })}
                    >
                        <option value="DOG">🐕 Собака</option>
                        <option value="CAT">🐈 Кошка</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label> Описание</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Расскажите об особенностях, характере, привычках..."
                    rows={4}
                />
            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid || isLoading}
            >
                {isLoading ? 'Создание...' : ' Создать анкету'}
            </button>
        </form>
    );
}