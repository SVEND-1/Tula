import React, { useState } from 'react';
import type { Gender, AnimalType, CreateAnimalRequest } from '../../types/animal/animal.types';
import ImageUpload from './ImageUpload';
import AnimalFormFields from './AnimalFormFields';

interface Props {
  onSubmit: (data: CreateAnimalRequest, imageBase64?: string) => Promise<void>;
  isLoading: boolean;
}

const EMPTY_FORM: CreateAnimalRequest = {
  name: '',
  age: 0,
  description: '',
  breed: '',
  gender: 'MAN',
  animalType: 'DOG',
};

const CreateAnimalForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<CreateAnimalRequest>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [fileName, setFileName] = useState('');

  const isFormValid = form.name.trim() && form.age > 0 && form.breed.trim();

  const handleImageChange = (base64: string, name: string) => {
    setImagePreview(base64);
    setImageBase64(base64);
    setFileName(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, imageBase64);

    // Сбрасываем форму после успешной отправки
    setForm(EMPTY_FORM);
    setImagePreview('');
    setImageBase64('');
    setFileName('');
  };

  return (
    <form onSubmit={handleSubmit} className="create-animal-form">
      <h2>📝 Создать анкету животного</h2>

      <div className="form-with-preview">
        <div className="form-fields">
          <ImageUpload
            imagePreview={imagePreview}
            fileName={fileName}
            onChange={handleImageChange}
          />

          <AnimalFormFields form={form} onChange={setForm} />

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Создание...' : '✨ Создать анкету'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateAnimalForm;
