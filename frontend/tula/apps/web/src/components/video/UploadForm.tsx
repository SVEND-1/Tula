import { useState, useRef } from 'react';
import { videoApi } from '../../api/videoApi';
import type { VideoResponse } from '../../types/video/video.types';

interface UploadFormProps {
    onClose: () => void;
    onUploaded: (v: VideoResponse) => void;
}

export function UploadForm({ onClose, onUploaded }: UploadFormProps) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [drag, setDrag] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('video/')) handleFile(f);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !file) return;
        setLoading(true);
        try {
            const res = await videoApi.upload(title, desc, file);
            onUploaded(res.data);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-overlay" onClick={onClose}>
            <div className="upload-panel" onClick={e => e.stopPropagation()}>
                <button className="upload-close" onClick={onClose}>✕</button>
                <h2 className="upload-title">Загрузить видео</h2>

                <div
                    className={`drop-zone ${drag ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                >
                    {preview ? (
                        <video src={preview} className="drop-preview" muted />
                    ) : (
                        <>
                            <div className="drop-icon">🎬</div>
                            <p>Перетащи видео сюда<br /><span>или нажми чтобы выбрать</span></p>
                        </>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                </div>

                <div className="upload-fields">
                    <input
                        className="upload-input"
                        placeholder="Название видео"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        className="upload-input upload-textarea"
                        placeholder="Описание (необязательно)"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                    />
                </div>

                <button
                    className={`upload-btn ${loading ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={!title.trim() || !file || loading}
                >
                    {loading ? <span className="spinner" /> : '🚀 Опубликовать'}
                </button>
            </div>
        </div>
    );
}