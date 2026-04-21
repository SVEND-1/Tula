import React from "react";

interface Props {
    url: string;
}

export const QrUrl: React.FC<Props> = ({ url }) => (
    <div className="qr-url">
        <span>{url}</span>
    </div>
);