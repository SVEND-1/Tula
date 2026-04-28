package org.example.tula.videos.db.comment;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.users.db.UserEntity;
import org.example.tula.videos.db.video.VideoEntity;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "video_comments")
public class VideoCommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text",length = 1000)
    private String text;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    private VideoEntity video;

    @ManyToOne
    private UserEntity user;
}