import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QrCode.scss';

interface QrCodeProps {
    ownerId: number;
    ownerName: string;
}

const QrCode: React.FC<QrCodeProps> = ({ ownerId, ownerName }) => {
    const [showQr, setShowQr] = useState(false);
    const [copied, setCopied] = useState(false);

    const profileUrl = `${window.location.origin}/owner/${ownerId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Приют "${ownerName}" на Adoptly`,
                    text: 'Посмотрите животных из этого приюта!',
                    url: profileUrl,
                });
            } catch (error) {
                console.log('Ошибка шаринга:', error);
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className="qr-container">
            <button
                className="qr-toggle-btn"
                onClick={() => setShowQr(!showQr)}
            >
                {showQr ? '🔒 Скрыть QR-код' : '📱 Показать QR-код'}
            </button>

            {showQr && (
                <div className="qr-modal">
                    <div className="qr-content">
                        <button className="qr-close" onClick={() => setShowQr(false)}>×</button>

                        <div className="qr-code">
                            <QRCodeSVG
                                value={profileUrl}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#ff8c42"
                                level="L"
                                includeMargin={true}
                            />
                        </div>

                        <p className="qr-text">Сканируйте QR-код, чтобы перейти к профилю приюта</p>

                        <div className="qr-actions">
                            <button className="qr-copy-btn" onClick={handleCopyLink}>
                                {copied ? ' Скопировано!' : ' Скопировать ссылку'}
                            </button>
                            <button className="qr-share-btn" onClick={handleShare}>
                                 Поделиться
                            </button>
                        </div>

                        <div className="qr-url">
                            <span>{profileUrl}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QrCode;