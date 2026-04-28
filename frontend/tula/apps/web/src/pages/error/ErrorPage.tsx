import { useLocation, useNavigate } from "react-router-dom";
import type {ApiError} from "../../types/error.types";
import styles from "./Error.module.css"

const ErrorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const error: ApiError | undefined = location.state?.error;

    const status = error?.status || 404;
    const message =
        error?.data?.message || "Страница не найдена";
    const details =
        error?.data?.errorMessage || "Проверьте URL адрес";

    return (
        <div className={styles.errorPage}>
            <div className={styles.errorCard}>
                <div className={styles.errorCode}>{status}</div>

                <h1 className={styles.errorTitle}>{message}</h1>

                <p className={styles.errorText}>{details}</p>

                <button
                    className={styles.backBtn}
                    onClick={() => navigate("/liked")}
                >
                    На главную
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;