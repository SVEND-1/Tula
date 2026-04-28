package org.example.tula.videos.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.videos.api.dto.request.VideoCommentRequest;
import org.example.tula.videos.api.dto.request.VideoUploadRequest;
import org.example.tula.videos.api.dto.response.CommentResponse;
import org.example.tula.videos.api.dto.response.VideoResponse;
import org.example.tula.videos.domain.VideoService;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Tag(name = "Video", description = "Управления видео, лайками и комментариями")
public class VideoController {

    private final VideoService videoService;

    @Operation(summary = "Загрузить видео", description = "Загружает видео файл на сервер и сохраняет метаданные")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VideoResponse> upload(
            @RequestParam String title,//JSON не работает с видео файдлм
            @RequestParam String description,
            @RequestParam MultipartFile file
    ) {
        VideoUploadRequest request = new VideoUploadRequest(title, description);
        return ResponseEntity.ok(videoService.upload(request, file));
    }

    @Operation(summary = "Получить список видео",description = "Получить список с паггинацией")
    @GetMapping
    public ResponseEntity<Page<VideoResponse>> getAllVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(videoService.getAll(page, size));
    }


    @Operation(summary = "Получить видео по ID", description = "Возвращает видео по его идентификатору")
    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(videoService.getById(id));
    }

    @Operation(summary = "Удалить видео", description = "Удаляет видео и его файл с сервера по ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        videoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Поставить / убрать лайк", description = "Переключает лайк текущего авторизованного пользователя на видео")
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long id
    ) {
        videoService.toggleLike(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Добавить комментарий", description = "Добавляет комментарий к видео от текущего авторизованного пользователя")
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @RequestBody VideoCommentRequest request
    ) {
        return ResponseEntity.ok(videoService.addComment(id, request));
    }

    @Operation(summary = "Стриминг видео", description = "Возвращает видео файл для просмотра")
    @GetMapping("/{id}/stream")
    public ResponseEntity<Resource> streamVideo(@PathVariable Long id) {
        return videoService.streamVideo(id);
    }

    @Operation(summary = "Удалить комментарий", description = "Удаляет комментарий по его ID")
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId
    ) {
        videoService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}