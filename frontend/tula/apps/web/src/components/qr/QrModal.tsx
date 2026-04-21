import React from "react";

interface Props {
    onClose: () => void;
    children: React.ReactNode;
}

export const QrModal: React.FC<Props> = ({ onClose, children }) => (
    <div className="qr-modal">
        <div className="qr-content">
            <button className="qr-close" onClick={onClose}>
                ×
            </button>
            {children}
        </div>
    </div>
);