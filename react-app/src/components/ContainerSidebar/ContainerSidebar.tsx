import { useState, useEffect } from 'react';
import type { ContainerInfo, ContainerReview } from '../../types';
import { getContainerReviews, createContainerReview } from '../../api';
import { getWasteTypeName, getWasteTypeColor } from '../../types';
import './ContainerSidebar.css';

interface ContainerSidebarProps {
    container: ContainerInfo | null;
    onClose: () => void;
}

export function ContainerSidebar({ container, onClose }: ContainerSidebarProps) {
    const [reviews, setReviews] = useState<ContainerReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!container) return;

        const loadReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getContainerReviews(container.id);
                setReviews(data);
            } catch (err) {
                setError('Не удалось загрузить отзывы');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [container]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!container) return;
        
        if (!authorName.trim()) {
            setError('Пожалуйста, укажите ваше имя');
            return;
        }
        
        if (rating === 0) {
            setError('Пожалуйста, выберите оценку');
            return;
        }

        setSubmitting(true);
        setError(null);
        
        try {
            const newReview = await createContainerReview(container.id, {
                authorName: authorName.trim(),
                rating,
                comment: comment.trim() || undefined,
            });
            
            setReviews([newReview, ...reviews]);
            setAuthorName('');
            setRating(0);
            setHoverRating(0);
            setComment('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при отправке отзыва');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!container) return null;

    return (
        <div className="container-sidebar">
            <div className="container-sidebar__header">
                <h2 className="container-sidebar__title">Мусорный контейнер</h2>
                <button 
                    className="container-sidebar__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
            
            <div className="container-sidebar__content">
                <div className="container-sidebar__section">
                    <h3 className="container-sidebar__section-title">Адрес</h3>
                    <p className="container-sidebar__address">
                        {container.address.settlement}<br />
                        {container.address.district}<br />
                        {container.address.street}, {container.address.house}
                    </p>
                </div>

                {container.wasteTypes && container.wasteTypes.length > 0 && (
                    <div className="container-sidebar__section">
                        <h3 className="container-sidebar__section-title">Типы отходов</h3>
                        <div className="waste-types-list">
                            {container.wasteTypes.map((type, index) => (
                                <div 
                                    key={index} 
                                    className="waste-type-badge"
                                    style={{ 
                                        backgroundColor: getWasteTypeColor(type),
                                        color: 'white'
                                    }}
                                >
                                    {getWasteTypeName(type)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="container-sidebar__section">
                    <h3 className="container-sidebar__section-title">Оставить отзыв</h3>
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-group">
                            <label htmlFor="authorName">Ваше имя</label>
                            <input
                                id="authorName"
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Введите имя"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rating">Оценка</label>
                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-input ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        disabled={submitting}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Комментарий</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Расскажите о состоянии площадки"
                                rows={4}
                                disabled={submitting}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={submitting || !authorName.trim() || rating === 0}
                        >
                            {submitting ? 'Отправка...' : 'Отправить отзыв'}
                        </button>
                    </form>
                </div>

                <div className="container-sidebar__section">
                    <h3 className="container-sidebar__section-title">
                        Отзывы {reviews.length > 0 && `(${reviews.length})`}
                    </h3>
                    
                    {loading && <div className="reviews-loading">Загрузка отзывов...</div>}
                    
                    {!loading && reviews.length === 0 && (
                        <div className="reviews-empty">Отзывов пока нет. Будьте первым!</div>
                    )}

                    {!loading && reviews.length > 0 && (
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <span className="review-author">{review.authorName}</span>
                                        <div className="review-rating">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i} className={i < review.rating ? 'star active' : 'star'}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="review-comment">{review.comment}</p>
                                    )}
                                    <div className="review-date">{formatDate(review.createdAt)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
