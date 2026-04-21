import React from "react";

interface Props {
    copied: boolean;
    onCopy: () => void;
    onShare: () => void;
}

export const QrActions: React.FC<Props> = ({
                                               copied,
                                               onCopy,
                                               onShare,
                                           }) => (
    <div className="qr-actions">
        <button className="qr-copy-btn" onClick={onCopy}>
            {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>

        <button className="qr-share-btn" onClick={onShare}>
            Поделиться
        </button>
    </div>
);