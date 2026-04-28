package org.example.tula.videos.db.like;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.users.db.UserEntity;
import org.example.tula.videos.db.video.VideoEntity;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "video_likes")
public class VideoLikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private VideoEntity video;

    @ManyToOne
    private UserEntity user;
}
