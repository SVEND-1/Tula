package org.example.tula.users.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.follow.db.FollowEntity;
import org.example.tula.likes.db.LikeEntity;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.payments.db.PaymentEntity;
import org.example.tula.reviews.db.ReviewEntity;
import org.example.tula.subscriptions.db.SubscriptionEntity;

import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email",unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "owner")
    private OwnerEntity owner;

    @OneToMany(mappedBy = "reviewer")
    private List<ReviewEntity> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<LikeEntity> likes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PaymentEntity> payments = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    private SubscriptionEntity subscription;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<FollowEntity> follows = new ArrayList<>();

}
