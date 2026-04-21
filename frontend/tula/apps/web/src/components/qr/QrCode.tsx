import React, { useState } from "react";
import { QrToggleButton } from "./QrToggleButton";
import { QrModal } from "./QrModal";
import { QrCodeBlock } from "./QrCodeBlock";
import { QrActions } from "./QrActions";
import { QrUrl } from "./QrUrl";

interface QrCodeProps {
    ownerId: number;
    ownerName: string;
}

export const QrCode: React.FC<QrCodeProps> = ({ ownerId, ownerName }) => {
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
                    text: "Посмотрите животных из этого приюта!",
                    url: profileUrl,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className="qr-container">
            <QrToggleButton
                show={showQr}
                onToggle={() => setShowQr(!showQr)}
            />

            {showQr && (
                <QrModal onClose={() => setShowQr(false)}>
                    <QrCodeBlock url={profileUrl} />

                    <p className="qr-text">
                        Сканируйте QR-код, чтобы перейти к профилю приюта
                    </p>

                    <QrActions
                        copied={copied}
                        onCopy={handleCopyLink}
                        onShare={handleShare}
                    />

                    <QrUrl url={profileUrl} />
                </QrModal>
            )}
        </div>
    );
};