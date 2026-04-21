import { useCallback } from 'react';

export const useSound = () => {
    const playLikeSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);

            setTimeout(() => audioContext.close(), 500);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, []);

    const playDislikeSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.3;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);

            setTimeout(() => audioContext.close(), 500);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, []);

    const playMessageSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 660;
            gainNode.gain.value = 0.2;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
            oscillator.stop(audioContext.currentTime + 0.2);

            setTimeout(() => audioContext.close(), 500);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, []);

    return { playLikeSound, playDislikeSound, playMessageSound };
};