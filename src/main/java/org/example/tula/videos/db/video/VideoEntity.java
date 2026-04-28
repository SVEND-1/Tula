package org.example.tula.videos.db.video;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.users.db.UserEntity;
import org.example.tula.videos.db.comment.VideoCommentEntity;
import org.example.tula.videos.db.like.VideoLikeEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "videos")
public class VideoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description",length = 1000)
    private String description;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "video",fetch = FetchType.EAGER)
    private List<VideoLikeEntity> likes = new ArrayList<>();

    @OneToMany(mappedBy = "video",fetch = FetchType.EAGER)
    private List<VideoCommentEntity> comments = new ArrayList<>();

    @PreRemove
    private void preRemove() {//TODO КАК В ЭТОМ КЛАССЕ СДЕЛАТЬ В ДРУГИХ ТОЖЕ
        likes.clear();
        comments.clear();
    }
}