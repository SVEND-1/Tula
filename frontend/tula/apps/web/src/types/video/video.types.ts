
export interface VideoResponse {
    id: number;
    title: string;
    description: string;
    url: string;
    likesCount: number;
    comments: CommentResponse[];
    createdAt: string;
}

export interface CommentResponse {
    id: number;
    text: string;
    authorName: string;
    createdAt: string;
}

export interface PageResponse {
    content: VideoResponse[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface VideoUploadRequest {
    title: string;
    description: string;
    file: File;
}