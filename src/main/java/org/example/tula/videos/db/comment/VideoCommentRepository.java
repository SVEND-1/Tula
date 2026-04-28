package org.example.tula.videos.db.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoCommentRepository extends JpaRepository<VideoCommentEntity, Long> {
    List<VideoCommentEntity> findAllByVideoId(Long videoId);
}