package org.example.tula.owners.domain;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.StatusAnimal;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.db.StatusAnswer;
import org.example.tula.likes.domain.LikeService;
import org.example.tula.notify.event.NotifyEvent;
import org.example.tula.notify.event.NotifyType;
import org.example.tula.notify.kafka.NotifyKafkaProducer;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.owners.db.OwnerRepository;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OwnerService {

    private final UserService userService;
    private final AnimalService animalService;
    private final LikeService likeService;
    private final NotifyKafkaProducer notifyKafkaProducer;
    private final OwnerRepository ownerRepository;
    private final AnimalMapper animalMapper;


    public String createOwner(String name){
        try {
            ownerRepository.save(OwnerEntity.builder()
                            .name(name)
                            .owner(userService.getCurrentUser())
                    .build());
            return "Успешно";
        }catch (Exception e) {
            log.error("Не удалось создать приют ,ex={}" ,e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public List<Animal> findAllAnimalByOwner(){
        try {
            return animalMapper.convertEntityListToDTO(
                    ownerRepository.findByOwnerId(userService.getCurrentUser().getId()).getAnimals()
            );
        }catch (Exception e){
            log.error("Не удалось найти животных у данного пользователя",e.getMessage());
            throw new RuntimeException(e);
        }
    }


    @Transactional//TODO возможно перенести в другой класс
    public String rejectionTakenAnimal(Long id) {
        try {
            Like like = likeService.findById(id);
            AnimalEntity animal = animalService.findAnimalEntityById(like.animalId());

            if(!isValidReject(like.userId(),animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.REJECT);

            animal.setStatus(StatusAnimal.DONT_TAKE);
            animalService.update(like.animalId(),animal);

            notifyStatus(like.userId(),animal.getName(), NotifyType.REJECT);

            return "Вы отказали в получение питомца";
        }catch (Exception e) {
            log.error("Не удалось отказать в получение питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String confirmTakenAnimal(Long likeId) {
        try {
            Like like = likeService.findById(likeId);
            AnimalEntity animal = animalService.findAnimalEntityById(like.animalId());

            if(!isValidConfirm(like.userId(),animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.CONFIRM);

            animal.setPersonTakeId(like.userId());
            animal.setStatus(StatusAnimal.TAKE);
            animalService.update(like.animalId(),animal);

            notifyStatus(like.userId(),animal.getName(),NotifyType.CONFIRM);

            return "Вы успешно одобрили получние питомца";
        }catch (Exception e) {
            log.error("Не удалось одобрить получние питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private boolean isValidReject(Long userId,AnimalEntity animal){
        //TODO ДОБАВИТЬ ПРОВЕРКУ НА ВЛАДЕЛЬЦА ЖИВОТНОГО
        if (userId == null) {
            log.warn("Нельзя отклонить заявку так как нету получателя");
            throw new IllegalArgumentException("Нельзя отклонить заявку так как нету получателя");
        }
        return true;
    }

    private boolean isValidConfirm(Long userId,AnimalEntity animal){
        if (userId == null) {
            throw new IllegalArgumentException("Нельзя одобрить заявку так как нету получателя");
        }

        if (animal.getStatus().name().equals("TAKE")) {
            throw new IllegalArgumentException("Данный питомец был взят");
        }

        //TODO ДОБАВИТЬ ПРОВЕРКУ НА ВЛАДЕЛЬЦА ЖИВОТНОГО
        return true;
    }

    private void notifyStatus(Long userId,String animalName,NotifyType notifyType) {
        UserEntity user = userService.findUserById(userId);

        Map<String, String> params = Map.of(
                "animalName", animalName,
                "userName", user.getName()
        );

        NotifyEvent notifyEvent = new NotifyEvent(
                user.getEmail(),
                params,
                notifyType
        );

        notifyKafkaProducer.sendMessageToKafka(notifyEvent);
    }
}
