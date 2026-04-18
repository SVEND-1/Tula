package org.example.tula.reviews.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.users.db.UserEntity;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reviews")
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content")
    private String content;

    @ManyToOne()
    private UserEntity reviewer;

    @ManyToOne()
    private OwnerEntity reviewedBy;

    @Column(name = "create_at")
    private LocalDateTime createdAt;
}
