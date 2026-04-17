package org.example.tula.likes.db;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "likes")
public class LikeEntity {//TODO подумать над ответом

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusLike status;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "animal_id")
    private Long animalId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
