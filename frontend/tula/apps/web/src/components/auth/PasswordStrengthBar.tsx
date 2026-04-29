import type { PasswordStrength } from './usePasswordStrength';
import './PasswordStrengthBar.css';

interface Props {
    strength: PasswordStrength;
}

export default function PasswordStrengthBar({ strength }: Props) {
    if (strength.level === 'empty') return null;

    const { checks, label, level, score } = strength;

    const hints: string[] = [];
    if (!checks.minLength) hints.push('минимум 6 символов');
    if (!checks.hasUpper)  hints.push('заглавная буква');
    if (!checks.hasLower)  hints.push('строчная буква');
    if (!checks.hasNumber) hints.push('цифра');
    if (!checks.hasSpecial) hints.push('спецсимвол (!@#$...)');

    return (
        <div className="psb-wrap">
            {/* Полоска из 4 сегментов */}
            <div className="psb-bar">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className={`psb-segment ${score >= i ? `psb-segment--${level}` : ''}`}
                    />
                ))}
            </div>

            {/* Подпись уровня */}
            <span className={`psb-label psb-label--${level}`}>{label}</span>

            {/* Подсказки чего не хватает */}
            {hints.length > 0 && (
                <p className="psb-hints">
                    Добавьте: {hints.join(', ')}
                </p>
            )}
        </div>
    );
}
