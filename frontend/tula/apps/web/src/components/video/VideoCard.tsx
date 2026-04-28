import { useRef, useEffect, useState } from 'react';
import { videoApi } from '../../api/videoApi';
import type { VideoResponse, CommentResponse } from '../../types/video/video.types';

interface VideoCardProps {
    video: VideoResponse;
    isActive: boolean;
    onLike: (id: number) => void;
    onCommentDeleted?: () => void;
}

export function VideoCard({ video, isActive, onLike, onCommentDeleted }: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(video.likesCount);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<CommentResponse[]>(video.comments ?? []);
    const [muted, setMuted] = useState(true);
    const [heartAnim, setHeartAnim] = useState(false);
    const [currentUserName, setCurrentUserName] = useState<string | null>(null);

    useEffect(() => {
        const userName = localStorage.getItem('userName') || localStorage.getItem('name');
        console.log('Current user name:', userName);
        setCurrentUserName(userName);
    }, []);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        if (isActive) {
            v.play().catch(() => { });
        } else {
            v.pause();
            v.currentTime = 0;
        }
    }, [isActive]);

    const handleLike = async () => {
        setLiked(l => !l);
        setLikes(l => liked ? l - 1 : l + 1);
        setHeartAnim(true);
        setTimeout(() => setHeartAnim(false), 600);
        try { await videoApi.toggleLike(video.id); onLike(video.id); } catch { }
    };

    const handleComment = async () => {
        if (!comment.trim()) return;
        try {
            const res = await videoApi.addComment(video.id, comment);
            setComments(c => [...c, res.data]);
            setComment('');
            if (onCommentDeleted) onCommentDeleted();
        } catch { }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Удалить комментарий?')) return;
        try {
            await videoApi.deleteComment(commentId);
            setComments(c => c.filter(comment => comment.id !== commentId));
            if (onCommentDeleted) onCommentDeleted();
        } catch (error) {
            console.error('Ошибка удаления комментария:', error);
            alert('Не удалось удалить комментарий');
        }
    };

    const handleDoubleTap = () => {
        if (!liked) handleLike();
    };

    const canDeleteComment = (commentAuthorName: string) => {
        if (!currentUserName || !commentAuthorName) return false;
        return currentUserName === commentAuthorName;
    };

    return (
        <div className="video-card">
            <video
                ref={videoRef}
                src={`/api/videos/${video.id}/stream`}
                loop
                muted={muted}
                playsInline
                className="video-el"
                onDoubleClick={handleDoubleTap}
            />

            {heartAnim && <div className="heart-burst">❤️</div>}
            <div className="video-gradient" />

            <div className="video-info">
                <h3 className="video-title-text">{video.title}</h3>
                {video.description && <p className="video-desc">{video.description}</p>}
            </div>

            <div className="video-actions">
                <button
                    className={`action-btn like-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <span className="action-icon">❤️</span>
                    <span className="action-count">{likes}</span>
                </button>

                <button className="action-btn" onClick={() => setShowComments(s => !s)}>
                    <span className="action-icon">💬</span>
                    <span className="action-count">{comments.length}</span>
                </button>

                <button className={`action-btn ${muted ? 'muted' : ''}`} onClick={() => setMuted(m => !m)}>
                    <span className="action-icon">{muted ? '🔇' : '🔊'}</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-drawer" onClick={e => e.stopPropagation()}>
                    <div className="comments-header">
                        <span>Комментарии ({comments.length})</span>
                        <button onClick={() => setShowComments(false)}>✕</button>
                    </div>
                    <div className="comments-list">
                        {comments.length === 0 && <p className="no-comments">Будь первым 👇</p>}
                        {comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-author">{c.authorName}</span>
                                    {canDeleteComment(c.authorName) && (
                                        <button
                                            className="delete-comment-btn"
                                            onClick={() => handleDeleteComment(c.id)}
                                            title="Удалить комментарий"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                                <span className="comment-text">{c.text}</span>
                                <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="comment-input-row">
                        <input
                            className="comment-input"
                            placeholder="Написать комментарий..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleComment()}
                        />
                        <button className="comment-send" onClick={handleComment}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}