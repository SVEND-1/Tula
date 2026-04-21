import React from "react";

interface Props {
    show: boolean;
    onToggle: () => void;
}

export const QrToggleButton: React.FC<Props> = ({ show, onToggle }) => (
    <button className="qr-toggle-btn" onClick={onToggle}>
        {show ? "🔒 Скрыть QR-код" : "📱 Показать QR-код"}
    </button>
);