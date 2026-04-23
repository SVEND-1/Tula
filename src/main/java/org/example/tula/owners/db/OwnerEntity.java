package org.example.tula.owners.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.follow.db.FollowEntity;
import org.example.tula.reviews.db.ReviewEntity;
import org.example.tula.users.db.UserEntity;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "owners", indexes = {
        @Index(name = "idx_owners_owner_id", columnList = "owner_id")
})
public class OwnerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_name")
    private String ownerName;

    @OneToOne
    private UserEntity owner;

    @OneToMany(mappedBy = "owner",cascade = CascadeType.ALL)
    private List<AnimalEntity> animals;

    @OneToMany(mappedBy = "reviewedBy",cascade = CascadeType.ALL)
    private List<ReviewEntity> reviews;

    @OneToMany(mappedBy = "owner")
    private List<FollowEntity> follows = new ArrayList<>();
}
