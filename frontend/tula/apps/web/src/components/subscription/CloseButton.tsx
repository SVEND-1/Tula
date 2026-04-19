import React from 'react';
import './CloseButton.css';

interface CloseButtonProps {
    onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
    return (
        <button className="close-button" onClick={onClose}>
            ×
        </button>
    );
};

export default CloseButton;