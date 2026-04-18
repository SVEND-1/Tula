package org.example.tula.likes.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.users.db.UserEntity;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "likes")
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusLike status;

    @ManyToOne()
    private UserEntity user;

    @Column(name = "status_answer")
    @Enumerated(EnumType.STRING)
    private StatusAnswer statusAnswer;

    @ManyToOne()
    private AnimalEntity animal;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
