export type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong' | 'very-strong';

export interface PasswordStrength {
    level: StrengthLevel;
    score: number;       // 0–4
    label: string;
    checks: {
        minLength: boolean;    // >= 6
        hasUpper: boolean;     // A-Z
        hasLower: boolean;     // a-z
        hasNumber: boolean;    // 0-9
        hasSpecial: boolean;   // !@#$... etc
    };
}

export function usePasswordStrength(password: string): PasswordStrength {
    const checks = {
        minLength: password.length >= 6,
        hasUpper:  /[A-Z]/.test(password),
        hasLower:  /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    if (!password) {
        return { level: 'empty', score: 0, label: '', checks };
    }

    const score = Object.values(checks).filter(Boolean).length;

    let level: StrengthLevel;
    let label: string;

    if (!checks.minLength) {
        level = 'weak';
        label = 'Слишком короткий';
    } else if (score <= 2) {
        level = 'weak';
        label = 'Слабый';
    } else if (score === 3) {
        level = 'medium';
        label = 'Средний';
    } else if (score === 4) {
        level = 'strong';
        label = 'Надёжный';
    } else {
        level = 'very-strong';
        label = 'Отличный';
    }

    return { level, score, label, checks };
}