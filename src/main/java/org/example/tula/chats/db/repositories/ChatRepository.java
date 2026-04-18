package org.example.tula.chats.db.repositories;

import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.chats.db.entities.ChatEntity;
import org.example.tula.users.db.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

    @Query("""
            SELECT COUNT(c) > 0 FROM ChatEntity c
            WHERE (c.buyer = :buyer)
            AND (c.animal = :animal)
            """)
    boolean existsChat(
            @Param("buyer") UserEntity currentUser,
            @Param("animal") AnimalEntity animalEntity
    );

    @Query("""
            SELECT c FROM ChatEntity c
            WHERE (c.seller.id = :userId)
            OR (c.buyer.id = :userId)
            """)
    List<ChatEntity> findAllByUserId(
            @Param("userId") Long userId,
            Pageable pageable
    );
}
