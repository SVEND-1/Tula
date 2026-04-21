import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
    url: string;
}

export const QrCodeBlock: React.FC<Props> = ({ url }) => (
    <div className="qr-code">
        <QRCodeSVG
            value={url}
            size={200}
            bgColor="#ffffff"
            fgColor="#ff8c42"
            level="L"
            includeMargin
        />
    </div>
);