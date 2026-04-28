package org.example.tula.videos.db.like;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideoLikeRepository extends JpaRepository<VideoLikeEntity, Long> {
    Optional<VideoLikeEntity> findByVideoIdAndUserId(Long videoId, Long userId);
    boolean existsByVideoIdAndUserId(Long videoId, Long userId);
}