package org.example.tula.animals.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.likes.db.LikeEntity;
import org.example.tula.owners.db.OwnerEntity;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "animals")
public class AnimalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;

    @Column(name = "description")
    private String description;

    @Column(name = "breed")
    private String breed;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "animal_type")
    @Enumerated(EnumType.STRING)
    private AnimalType animalType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusAnimal status;

    @Column(name = "person_take_id")
    private Long personTakeId;//TODO поменять

    @OneToMany(mappedBy = "animal",cascade = CascadeType.ALL)
    private List<LikeEntity> likes;

    @ManyToOne
    private OwnerEntity owner;

    @Column(name = "create_at")
    private LocalDateTime createAt;
}
