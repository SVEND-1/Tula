package org.example.tula.videos.db.video;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<VideoEntity, Long> {
    List<VideoEntity> findAllByUserId(Long userId);
}
