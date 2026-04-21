import React from 'react';
import type { Gender, AnimalType, CreateAnimalRequest } from '../../types/animal/animal.types';

interface Props {
  form: CreateAnimalRequest;
  onChange: (updated: CreateAnimalRequest) => void;
}

// Только поля — без state, без сабмита, без картинки
const AnimalFormFields: React.FC<Props> = ({ form, onChange }) => (
  <>
    <div className="form-group">
      <label>🐕 Имя животного *</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        placeholder="Например: Бобик, Мурка"
        required
      />
    </div>

    <div className="form-group">
      <label>📅 Возраст (лет) *</label>
      <input
        type="number"
        value={form.age}
        onChange={(e) => onChange({ ...form, age: parseInt(e.target.value) || 0 })}
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
        onChange={(e) => onChange({ ...form, breed: e.target.value })}
        placeholder="Например: Лабрадор, Персидская"
        required
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>⚥ Пол</label>
        <select
          value={form.gender}
          onChange={(e) => onChange({ ...form, gender: e.target.value as Gender })}
        >
          <option value="MAN">Мальчик</option>
          <option value="WOMAN">Девочка</option>
        </select>
      </div>

      <div className="form-group">
        <label>🐶 Тип животного</label>
        <select
          value={form.animalType}
          onChange={(e) => onChange({ ...form, animalType: e.target.value as AnimalType })}
        >
          <option value="DOG">🐕 Собака</option>
          <option value="CAT">🐈 Кошка</option>
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>📝 Описание</label>
      <textarea
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        placeholder="Расскажите об особенностях, характере, привычках..."
        rows={4}
      />
    </div>
  </>
);

export default AnimalFormFields;
