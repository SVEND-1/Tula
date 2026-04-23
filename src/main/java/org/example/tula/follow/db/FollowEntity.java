package org.example.tula.follow.db;


import jakarta.persistence.*;
import lombok.*;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.users.db.UserEntity;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "follows")
public class FollowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private OwnerEntity owner;

    @ManyToOne
    private UserEntity user;

    @Column(name = "create_at")
    private LocalDateTime createdAt;
}
