import { useState, useRef, useEffect, useCallback } from 'react';
import { videoApi } from '../../api/videoApi';
import { UploadForm } from '../../components/video/UploadForm';
import { VideoCard } from '../../components/video/VideoCard';
import type { VideoResponse } from '../../types/video/video.types';
import './../../style/VideoFeed.scss';
import {useNavigate} from "react-router-dom";
import styles from "../../components/receipt/emptyReceipt/EmptyReceipt.module.css";

import videoIcon from "../../assets/video.svg"

export default function VideoFeed() {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [showUpload, setShowUpload] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef(false);

    const loadVideos = useCallback(async (pageNum: number) => {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await videoApi.getAll(pageNum);
            const data = res.data;
            setVideos(prev => pageNum === 0 ? data.content : [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage(pageNum);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [hasMore]);

    useEffect(() => { loadVideos(0); }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const cards = container.querySelectorAll('.video-card');

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(cards).indexOf(entry.target as HTMLElement);
                    if (idx !== -1) setActiveIdx(idx);
                    if (idx === videos.length - 1 && hasMore && !loadingRef.current) {
                        loadVideos(page + 1);
                    }
                }
            });
        }, { root: container, threshold: 0.6 });

        cards.forEach(c => io.observe(c));
        observerRef.current = io;
        return () => io.disconnect();
    }, [videos, hasMore, page, loadVideos]);

    const handleUploaded = (v: VideoResponse) => {
        setVideos(prev => [v, ...prev]);
        setActiveIdx(0);
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <header className="adopt-header">
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>
        <div className="feed-root">
            <div className="feed-container" ref={containerRef}>
                {videos.map((v, i) => (
                    <VideoCard key={v.id} video={v} isActive={i === activeIdx} onLike={() => {}} />
                ))}

                {loading && (
                    <div className="feed-loader">
                        <div className="loader-ring" />
                    </div>
                )}

                {!hasMore && videos.length > 0 && (
                    <div className="feed-end">
                        <span>Ты досмотрел до конца 🎉</span>
                    </div>
                )}

                {!loading && videos.length === 0 && (
                    <div className="feed-empty">
                        <div className="empty-icon"><img src={videoIcon} alt="video" className={styles.icon}/></div>
                        <p>Видео пока нет.<br />Будь первым!</p>
                    </div>
                )}
            </div>

            <button className="fab-upload" onClick={() => setShowUpload(true)}>
                <span className="fab-plus">+</span>
            </button>

            {showUpload && (
                <UploadForm onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
            )}
        </div>
        </>
    );
}