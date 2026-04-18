package org.example.tula.animals.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<AnimalEntity,Long> {

    @Query("""
        SELECT a FROM AnimalEntity a
        WHERE (:age IS NULL OR a.age <= :age)
          AND (:breed IS NULL OR a.breed = :breed)
          AND (:gender IS NULL OR a.gender = :gender)
          AND (:animalType IS NULL OR a.animalType = :animalType)
        """)
    List<AnimalEntity> findAllByFilter(
            @Param("age")Integer age,@Param("breed") String breed,
            @Param("gender")Gender gender,@Param("animalType") AnimalType animalType
    );
}
