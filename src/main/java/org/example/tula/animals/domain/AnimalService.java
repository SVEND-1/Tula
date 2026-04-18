package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalFeedFilter;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.db.*;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.api.dto.response.TakeResponse;
import org.example.tula.likes.db.StatusAnswer;
import org.example.tula.likes.domain.LikeService;
import org.example.tula.notify.event.NotifyEvent;
import org.example.tula.notify.event.NotifyType;
import org.example.tula.notify.kafka.NotifyKafkaProducer;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;
    private final UserService userService;
    private final LikeService likeService;
    private final NotifyKafkaProducer notifyKafkaProducer;

    public AnimalService(AnimalRepository animalRepository, AnimalMapper animalMapper,
                         @Lazy UserService userService, @Lazy LikeService likeService,
                         NotifyKafkaProducer notifyKafkaProducer) {
        this.animalRepository = animalRepository;
        this.animalMapper = animalMapper;
        this.userService = userService;
        this.likeService = likeService;
        this.notifyKafkaProducer = notifyKafkaProducer;
    }

    public List<Animal> petFeed(AnimalFeedFilter filter){
        return animalMapper.convertEntityListToDTO(
                animalRepository.findAllByFilter(
                        filter.age(),filter.breed(),
                        filter.gender(),filter.animalType()
                )
        );
    }

    public List<Animal> findAllAnimalByOwner(){
        return animalMapper.convertEntityListToDTO(
                animalRepository.findAllByOwnerId(userService.getCurrentUser().getId())
        );
    }

    public Animal findAnimalById(Long id) {
        return animalMapper.convertEntityToDTO(
                findAnimalEntityById(id)
        );
    }
    public AnimalEntity findAnimalEntityById(Long id) {
        return animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Питомец не найден"));
    }

    public Animal save(CreatedAnimalRequest request) {
        try {
            AnimalEntity animalEntity = animalRepository.save(//TODO добавть  владельца
                    AnimalEntity.builder()
                            .name(request.name())
                            .age(request.age())
                            .description(request.description())
                            .breed(request.breed())
                            .gender(request.gender())
                            .animalType(request.animalType())
                            .status(StatusAnimal.DONT_TAKE)
                            .owner(userService.getCurrentUser())
                            .createAt(LocalDateTime.now())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        }catch (Exception e) {
            log.error("Не удалось создать питомеца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public Animal update(Long id,AnimalEntity updatedEntity){
        try {
            AnimalEntity animal = findAnimalEntityById(id);
            AnimalEntity animalEntity = animalRepository.save(
                    AnimalEntity.builder()
                            .id(animal.getId())
                            .name(animal.getName())
                            .age(updatedEntity.getAge())
                            .description(updatedEntity.getDescription())
                            .breed(animal.getBreed())
                            .gender(animal.getGender())
                            .animalType(animal.getAnimalType())
                            .status(updatedEntity.getStatus())
                            .personTakeId(updatedEntity.getPersonTakeId())
                            .owner(animal.getOwner())
                            .createAt(animal.getCreateAt())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        }catch (Exception e){
            log.error("Не удалось обновить питомца");
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    public TakeResponse takenAnimal(Long id) {
        try {
            AnimalEntity animal = animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if (animal.getStatus().name().equals("TAKE")) {
                throw new IllegalArgumentException("Данный питомец был взят");
            }

            animal.setStatus(StatusAnimal.RESERVATION);
            animalRepository.save(animal);

            return new TakeResponse(
                    "Вы успешно зарезервировали питомца",
                    "s5090@inbox.ru",//TODO поменять
                    animal.getName()
            );
        }catch (Exception e) {
            log.error("Не удалось взять питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional//TODO возможно перенести в другой класс
    public String rejectionTakenAnimal(Long id) {//TODO ДОБАВИТЬ ОТКАЗ И УВЕДОМЛЕНИЕ
        try {
            Like like = likeService.findById(id);
            AnimalEntity animal = animalRepository.findById(like.animalId()).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if(!isValidReject(animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.REJECT);

            animal.setStatus(StatusAnimal.DONT_TAKE);
            animalRepository.save(animal);

            notifyStatus(like.userId(),animal.getName(),NotifyType.REJECT);

            return "Вы отказали в получение питомца";
        }catch (Exception e) {
            log.error("Не удалось отказать в получение питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String confirmTakenAnimal(Long likeId) {
        try {
            Like like = likeService.findById(likeId);
            AnimalEntity animal = animalRepository.findById(like.animalId()).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if(!isValidConfirm(like.userId(),animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.CONFIRM);

            animal.setPersonTakeId(like.userId());
            animal.setStatus(StatusAnimal.TAKE);
            animalRepository.save(animal);

            notifyStatus(like.userId(),animal.getName(),NotifyType.CONFIRM);

            return "Вы успешно одобрили получние питомца";
        }catch (Exception e) {
            log.error("Не удалось одобрить получние питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private boolean isValidReject(AnimalEntity animal){
        //TODO ДОБАВИТЬ ПРОВЕРКУ НА ВЛАДЕЛЬЦА ЖИВОТНОГО
        if (animal.getPersonTakeId() == null) {
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
