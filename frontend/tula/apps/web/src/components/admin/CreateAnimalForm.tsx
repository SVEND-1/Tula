import React, { useState, useRef } from 'react';
import type { Gender, AnimalType, CreateAnimalRequest } from '../../types/animal/animal.types.ts';

import styles from "../receipt/emptyReceipt/EmptyReceipt.module.css";

import folderIcon from "../../assets/folder.svg";
import createIcon from "../../assets/create.svg"

interface CreateAnimalFormProps {
    onSubmit: (data: CreateAnimalRequest, imageFile?: File) => Promise<void>;
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
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormValid = form.name.trim() && form.age > 0 && form.breed.trim();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form, imageFile || undefined);

        setForm({
            name: '',
            age: 0,
            description: '',
            breed: '',
            gender: 'MAN',
            animalType: 'DOG',
        });
        setImagePreview('');
        setImageFile(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-animal-form">
            <h2>Создать анкету животного</h2>

            <div className="form-with-preview">
                <div className="form-fields">
                    <div className="form-group">
                        <label>Фото животного</label>
                        <div className="file-input-wrapper">
                            <input
                                ref={fileInputRef}
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                            />
                            <label htmlFor="file-input" className="file-input-label">
                                <img src={folderIcon} alt="folder" className={styles.icon}
                                     style={{
                                         width: 25,
                                         height: 25}}
                                /> Выбрать фото
                            </label>
                        </div>
                        {fileName && <div className="file-name">📎 {fileName}</div>}
                    </div>

                    <div className="form-group">
                        <label>Имя животного *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Например: Бобик, Мурка"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Возраст (лет) *</label>
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
                        <label>Порода *</label>
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
                            <label>Тип животного</label>
                            <select
                                value={form.animalType}
                                onChange={(e) => setForm({ ...form, animalType: e.target.value as AnimalType })}
                            >
                                <option value="DOG">
                                    Собака
                                </option>
                                <option value="CAT">
                                    Кошка
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
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
                    ><img src={createIcon} alt="create" className={styles.icon}
                          style={{
                              width: 25,
                              height: 25,
                              marginBottom: -5,

                          }}
                    />
                        {isLoading ? 'Создание...' : 'Создать анкету'}
                    </button>
                </div>

                {imagePreview && (
                    <div className="image-preview-side">
                        <div className="preview-label">Предпросмотр</div>
                        <img src={imagePreview} alt="Предпросмотр" />
                    </div>
                )}
            </div>
        </form>
    );
}