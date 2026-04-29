export interface VideoResponse {
    id: number;
    title: string;
    description: string;
    filePath: string;
    createdAt: string;
    uploaderName: string;
    likesCount: number;
    comments: CommentResponse[];
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
 