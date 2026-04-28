package org.example.tula.chats.db.entities;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.chats.db.enums.Status;
import org.example.tula.users.db.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "chats")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private UserEntity seller;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private UserEntity buyer;

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private AnimalEntity animal;

    @Enumerated(EnumType.STRING)
    Status status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        status = Status.ACTIVE;
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
