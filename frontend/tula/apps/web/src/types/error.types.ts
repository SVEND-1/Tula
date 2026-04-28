export interface ErrorResponse {
    message: string;
    errorMessage: string;
    errorTime: string;
}

export interface ApiError {
    status: number;
    data?: ErrorResponse;
}