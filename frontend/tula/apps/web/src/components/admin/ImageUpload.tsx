import React, { useRef } from 'react';

interface Props {
  imagePreview: string;
  fileName: string;
  onChange: (base64: string, fileName: string) => void;
}

// Отвечает только за выбор файла и показ превью
const ImageUpload: React.FC<Props> = ({ imagePreview, fileName, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group">
      <label>🖼️ Фото животного</label>

      <div className="file-input-wrapper">
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          <span>📁</span> Выбрать фото
        </label>
      </div>

      {fileName && <div className="file-name">📎 {fileName}</div>}

      {imagePreview && (
        <div className="image-preview-side">
          <div className="preview-label">📸 Предпросмотр</div>
          <img src={imagePreview} alt="Предпросмотр" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
