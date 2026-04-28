package org.example.tula.videos.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.example.tula.videos.api.dto.request.VideoCommentRequest;
import org.example.tula.videos.api.dto.request.VideoUploadRequest;
import org.example.tula.videos.api.dto.response.CommentResponse;
import org.example.tula.videos.api.dto.response.VideoResponse;
import org.example.tula.videos.db.comment.VideoCommentEntity;
import org.example.tula.videos.db.comment.VideoCommentRepository;
import org.example.tula.videos.db.like.VideoLikeEntity;
import org.example.tula.videos.db.like.VideoLikeRepository;
import org.example.tula.videos.db.video.VideoEntity;
import org.example.tula.videos.db.video.VideoRepository;
import org.example.tula.videos.domain.mapper.VideoMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final VideoCommentRepository videoCommentRepository;
    private final VideoMapper videoMapper;
    private final UserService userService;

    @Value("${video.upload.dir:uploads/videos}")
    private String uploadDir;

    //================================Controller Methods================================================

    @Transactional
    public VideoResponse upload(VideoUploadRequest request, MultipartFile file) {
        try {
            log.info("Загрузка видео title={}", request.title());
            UserEntity user = userService.getCurrentUser();

            String filePath = saveFile(file);

            VideoEntity video = VideoEntity.builder()
                    .title(request.title())
                    .description(request.description())
                    .filePath(filePath)
                    .createdAt(LocalDateTime.now())
                    .user(user)
                    .build();

            VideoEntity saved = videoRepository.save(video);
            log.info("Видео сохранено с id={}", saved.getId());
            return videoMapper.convertEntityToDto(saved);
        } catch (Exception e) {
            log.error("Не удалось загрузить видео, ex={}", e.getMessage());
            throw new RuntimeException("Не удалось загрузить видео, ex=" + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<VideoResponse> getAll(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<VideoEntity> videoPage = videoRepository.findAll(pageable);
            return videoPage.map(videoMapper::convertEntityToDto);
        } catch (Exception e) {
            log.error("Не удалось получить список видео, ex={}", e.getMessage());
            throw new RuntimeException("Не удалось получить список видео, ex=" + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public VideoResponse getById(Long id) {
        try {
            VideoEntity video = findVideoById(id);
            return videoMapper.convertEntityToDto(video);
        } catch (Exception e) {
            log.error("Не удалось получить видео id={}, ex={}", id, e.getMessage());
            throw new RuntimeException("Не удалось получить видео, ex=" + e.getMessage());
        }
    }

    @Transactional
    public void delete(Long id) {
        try {
            VideoEntity video = findVideoById(id);
            deleteFile(video.getFilePath());
            videoRepository.deleteById(id);
            log.info("Видео с id={} удалено", id);
        } catch (Exception e) {
            log.error("Не удалось удалить видео id={}, ex={}", id, e.getMessage());
            throw new RuntimeException("Не удалось удалить видео, ex=" + e.getMessage());
        }
    }

    @Transactional
    public void toggleLike(Long videoId) {
        try {
            UserEntity user = userService.getCurrentUser();
            VideoEntity video = findVideoById(videoId);

            if (videoLikeRepository.existsByVideoIdAndUserId(videoId, user.getId())) {
                videoLikeRepository.findByVideoIdAndUserId(videoId, user.getId())
                        .ifPresent(like -> {
                            videoLikeRepository.delete(like);
                            log.info("Лайк удален с видео id={} пользователем id={}", videoId, user.getId());
                        });
            } else {
                VideoLikeEntity like = VideoLikeEntity.builder()
                        .video(video)
                        .user(user)
                        .build();
                videoLikeRepository.save(like);
                log.info("Лайк поставлен на видео id={} пользователем id={}", videoId, user.getId());
            }
        } catch (Exception e) {
            log.error("Ошибка при переключении лайка на видео id={}, ex={}", videoId, e.getMessage());
            throw new RuntimeException("Ошибка при переключении лайка, ex=" + e.getMessage());
        }
    }

    @Transactional
    public CommentResponse addComment(Long videoId, VideoCommentRequest request) {
        try {
            UserEntity user = userService.getCurrentUser();
            VideoEntity video = findVideoById(videoId);

            VideoCommentEntity comment = VideoCommentEntity.builder()
                    .text(request.text())
                    .createdAt(LocalDateTime.now())
                    .video(video)
                    .user(user)
                    .build();

            VideoCommentEntity saved = videoCommentRepository.save(comment);
            log.info("Комментарий добавлен к видео id={} пользователем id={}", videoId, user.getId());
            return videoMapper.convertCommentToDto(saved);
        } catch (Exception e) {
            log.error("Не удалось добавить комментарий к видео id={}, ex={}", videoId, e.getMessage());
            throw new RuntimeException("Не удалось добавить комментарий, ex=" + e.getMessage());
        }
    }

    @Transactional
    public void deleteComment(Long commentId) {
        try {
            videoCommentRepository.deleteById(commentId);
            log.info("Комментарий с id={} удален", commentId);
        } catch (Exception e) {
            log.error("Не удалось удалить комментарий id={}, ex={}", commentId, e.getMessage());
            throw new RuntimeException("Не удалось удалить комментарий, ex=" + e.getMessage());
        }
    }

    //================================Service Methods================================================

    private VideoEntity findVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Видео не найдено"));
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        isValidFileName(file);

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        log.info("Файл сохранен по пути={}", filePath);
        return filePath.toString();
    }

    private void deleteFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
            log.info("Файл удален по пути={}", filePath);
        } catch (IOException e) {
            log.warn("Не удалось удалить файл по пути={}, ex={}", filePath, e.getMessage());
        }
    }

    private void isValidFileName(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл не может быть пустым");
        }
        if (file.getSize() > 100 * 1024 * 1024) {
            throw new IllegalArgumentException("Файл слишком большой, надо до 100 МБ");
        }
    }
}