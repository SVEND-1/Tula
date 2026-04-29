import Field from "../global/Field";
import Button from "../global/Button";
import PasswordStrengthBar from "../PasswordStrengthBar";
import { usePasswordStrength } from "../usePasswordStrength";
import type {ResetPasswordFormProps} from "../../../types/auth/auth.types";

export default function ResetPasswordForm({
                                              newPassword,
                                              setNewPassword,
                                              confirmPassword,
                                              setConfirmPassword,
                                              handleSubmit,
                                              navigate
                                          }: ResetPasswordFormProps) {
    const strength = usePasswordStrength(newPassword);

    const passwordsMatch = newPassword === confirmPassword;

    const isFormValid =
        strength.checks.minLength &&
        confirmPassword.trim().length > 0 &&
        passwordsMatch;

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="new password"
                id="reset-new-password"
                type="password"
                value={newPassword}
                onInput={(e: any) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            <PasswordStrengthBar strength={strength} />

            <Field
                className="input-group"
                label="confirm password"
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onInput={(e: any) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            {confirmPassword && !passwordsMatch && (
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#f44336' }}>
                    Пароли не совпадают
                </p>
            )}

            <Button
                type="submit"
                className="submit-button"
                isDisabled={!isFormValid}
            >
                Сменить пароль
            </Button>

            <p
                onClick={() => navigate("/")}
                className="auth-link"
                style={{ cursor: "pointer" }}
            >
                Вернуться к входу
            </p>
        </form>
    );
}