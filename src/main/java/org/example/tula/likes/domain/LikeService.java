package org.example.tula.likes.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.api.dto.response.TakeResponse;
import org.example.tula.likes.db.LikeEntity;
import org.example.tula.likes.db.LikeRepository;
import org.example.tula.likes.db.StatusAnswer;
import org.example.tula.likes.db.StatusLike;
import org.example.tula.likes.domain.mapper.LikeMapper;
import org.example.tula.notify.event.NotifyEvent;
import org.example.tula.notify.event.NotifyType;
import org.example.tula.notify.kafka.NotifyKafkaProducer;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final LikeMapper likeMapper;
    private final AnimalService animalService;
    private final UserService userService;
    private final NotifyKafkaProducer notifyKafkaProducer;
    private final AnimalMapper animalMapper;

    public Like findById(Long id) {
        return likeMapper.convertEntityToDTO(
                likeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Реакция не найдена"))
        );
    }


    @Transactional
    public Like like(Long animalId) {//TODO ДОБАВИТЬ СОЗДАНИЕ ЧАТА
        try {
            TakeResponse takeResponse = animalService.takenAnimal(animalId);

            AnimalEntity animal = animalService.findAnimalEntityById(animalId);

            notify(takeResponse);

            return likeMapper.convertEntityToDTO(likeRepository.save(
                    LikeEntity.builder()
                            .status(StatusLike.LIKE)
                            .user(userService.getCurrentUser())
                            .animal(animal)
                            .createdAt(LocalDateTime.now())
                            .build()
            ));
        }catch (Exception e){
            log.error("Не удалось лакнуть питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public Like dislike(Long animalId) {
        AnimalEntity animal = animalService.findAnimalEntityById(animalId);

        return likeMapper.convertEntityToDTO(
                likeRepository.save(
                        LikeEntity.builder()
                                .status(StatusLike.DISLIKE)
                                .user(userService.getCurrentUser())
                                .animal(animal)
                                .createdAt(LocalDateTime.now())
                                .build()
                )
        );
    }

    @Transactional
    public Like setStatusAnswer(Long likeId, StatusAnswer answer) {
        try {
            LikeEntity like = likeRepository.findById(likeId).orElseThrow(() -> new EntityNotFoundException("Реакция не найдена"));

            if(like.getStatus().equals(StatusLike.DISLIKE) &&
                    !like.getUser().getId().equals(userService.getCurrentUser().getId())) {
                log.error("Нельзя сменить у DISLIKE");
                throw new IllegalArgumentException("Нельзя сменить у DISLIKE");
            }

            like.setStatusAnswer(answer);
            return likeMapper.convertEntityToDTO(likeRepository.save(like));
        }catch (Exception e){
            log.error("Не удалось сменить статус на answer={},ex-{}",answer, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private void notify(TakeResponse takeResponse) {
        Map<String, String> params = Map.of(
                "animalName", takeResponse.animalName(),
                "userName", userService.getCurrentUser().getName()
        );

        NotifyEvent notifyEvent = new NotifyEvent(
                takeResponse.ownerEmail(),
                params,
                NotifyType.LIKE
        );

        notifyKafkaProducer.sendMessageToKafka(notifyEvent);
    }
}
