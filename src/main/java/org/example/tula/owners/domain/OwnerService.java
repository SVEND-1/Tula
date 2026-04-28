package org.example.tula.owners.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.StatusAnimal;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.owners.domain.exceptions.NotPetOwnerException;
import org.example.tula.owners.domain.exceptions.OwnerNotCreatedException;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.db.StatusAnswer;
import org.example.tula.likes.domain.LikeService;
import org.example.tula.notify.event.NotifyEvent;
import org.example.tula.notify.event.NotifyType;
import org.example.tula.notify.kafka.NotifyKafkaProducer;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.owners.db.OwnerRepository;
import org.example.tula.owners.domain.exceptions.PetAlreadyTakenException;
import org.example.tula.owners.domain.exceptions.RecipientNotFoundException;
import org.example.tula.reviews.api.dto.Review;
import org.example.tula.reviews.domain.mapper.ReviewMapper;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ReviewMapper reviewMapper;


    //====================================CONTROLLER METHODS=======================================================

    @Transactional
    public List<Animal> findAllAnimalByOwner(){
        try {
            isValidCreatedOwner();

            return animalMapper.convertEntityListToDTO(
                    ownerRepository.findByOwnerId(userService.getCurrentUser().getId()).getAnimals()
            );
        }catch (Exception e){
            log.error("Не удалось найти животных у данного пользователя,ex={}",e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional(readOnly = true)
    public OwnerProfileResponse profile(Long ownerId){
        try {
            OwnerEntity owner = findByIdEntity(ownerId);
            List<Animal> animals = animalMapper.convertEntityListToDTO(owner.getAnimals());
            List<Review> reviews = reviewMapper.convertEntityListToDTO(owner.getReviews());
            return new OwnerProfileResponse(
                    owner.getOwnerName(),
                    animals,
                    reviews
            );
        }catch (Exception e){
            log.error("Не удалось загрузить профиль приюта,ex={}",e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    public String createOwner(String name){
        try {
            UserEntity user = userService.getCurrentUser();

            ownerRepository.save(OwnerEntity.builder()
                    .ownerName(name)
                    .owner(user)
                    .build());

            return "Успешно";
        }catch (Exception e) {
            log.error("Не удалось создать приют ,ex={}" ,e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String setOwnerName(Long ownerId, String ownerName){
        try {
            OwnerEntity updated = findByIdEntity(ownerId);
            updated.setOwnerName(ownerName);
            ownerRepository.save(updated);
            return "Успешно";
        }catch (Exception e){
            log.error("Не получилось обновить имя приюта ,ex={}",e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public String rejectionTakenAnimal(Long id) {
        try {
            isValidCreatedOwner();

            Like like = likeService.findById(id);
            AnimalEntity animal = animalService.findAnimalEntityById(like.animal().id());

            if(!isValidReject(like.user().id(), animal) && !isValidOwner(animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.REJECT);

            animalService.updateTake(like.animal().id(), StatusAnimal.DONT_TAKE,null);

            notifyStatus(like.user().id(), animal.getName(), NotifyType.REJECT);

            return "Вы отказали в получение питомца";
        }catch (Exception e) {
            log.error("Не удалось отказать в получение питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public String confirmTakenAnimal(Long likeId) {
        try {
            isValidCreatedOwner();

            Like like = likeService.findById(likeId);
            AnimalEntity animal = animalService.findAnimalEntityById(like.animal().id());

            if(!isValidConfirm(like.user().id(), animal) && !isValidOwner(animal)) {
                return "Что то пошло не так";
            }

            likeService.setStatusAnswer(like.id(), StatusAnswer.CONFIRM);

            animalService.updateTake(like.animal().id(), StatusAnimal.TAKE,like.user().id());

            notifyStatus(like.user().id(), animal.getName(),NotifyType.CONFIRM);

            return "Вы успешно одобрили получние питомца";
        }catch (Exception e) {
            log.error("Не удалось одобрить получние питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
    //====================================SERVICE METHODS=======================================================

    public OwnerEntity findByIdEntity(Long id){
        return ownerRepository.findByOwnerId(id);
    }

    private boolean isValidReject(Long userId,AnimalEntity animal){
        if (userId == null) {
            log.warn("Нельзя отклонить заявку так как нету получателя");
            throw new RecipientNotFoundException("Нельзя отклонить заявку так как нету получателя");
        }
        return true;
    }

    private boolean isValidConfirm(Long userId,AnimalEntity animal){
        if (userId == null) {
            throw new RecipientNotFoundException("Нельзя одобрить заявку так как нету получателя");
        }

        if (animal.getStatus().name().equals("TAKE")) {
            throw new PetAlreadyTakenException("Данный питомец был взят");
        }
        return true;
    }

    private boolean isValidOwner(AnimalEntity animal){
        if(animal.getOwner().getOwner().getId() != userService.getCurrentUser().getId()){
            throw new NotPetOwnerException("Вы не являетессь хозяеном питомца");
        }
        return true;
    }

    private boolean isValidCreatedOwner(){
        if(userService.getCurrentUser().getOwner() == null) {
            log.warn("Для начало создайте питомник");
            throw new OwnerNotCreatedException("Для начало создайте питомник");
        }
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
