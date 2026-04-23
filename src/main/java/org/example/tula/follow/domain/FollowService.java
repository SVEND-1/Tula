package org.example.tula.follow.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.follow.api.dto.Follow;
import org.example.tula.follow.db.FollowEntity;
import org.example.tula.follow.db.FollowRepository;
import org.example.tula.follow.domain.mapper.FollowMapper;
import org.example.tula.owners.api.dto.Owner;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.owners.db.OwnerEntity;
import org.example.tula.owners.domain.OwnerService;
import org.example.tula.owners.domain.mapper.OwnerMapper;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final OwnerService ownerService;
    private final UserService userService;
    private final OwnerMapper ownerMapper;
    private final FollowMapper followMapper;

    public FollowEntity findByIdEntity(Long id) {
        return followRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Подписка не найдена"));
    }

    public Follow findById(Long id) {
        return followMapper.convertEntityToDTO(findByIdEntity(id));
    }

    @Transactional(readOnly = true)
    public OwnerProfileResponse findOwnerByFollowId(Long followId) {
        try {
            FollowEntity followEntity = findByIdEntity(followId);
            return ownerService.profile(followEntity.getOwner().getId());
        }catch (Exception e) {
            log.error("Не удалось найти приют по подписки,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional(readOnly = true)
    public List<Owner> findAllOwners() {
        try {
            UserEntity user = userService.getCurrentUser();
            List<OwnerEntity> owners = user.getFollows()
                    .stream()
                    .map(FollowEntity::getOwner)
                    .toList();

            return ownerMapper.convertEntityListToDTO(owners);
        }catch (Exception e) {
            log.error("Не удалось найти все подписки для пользователя,ex={}",e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public Integer countFollowersByOwner(Long id) {
        try {
            OwnerEntity owner = ownerService.findByIdEntity(id);
            return owner.getFollows().size();
        }catch (Exception e) {
            log.error("Не получилось получить количество подписчиков,у={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional()
    public String save(Long ownerId){
        try {
            OwnerEntity owner = ownerService.findByIdEntity(ownerId);
            UserEntity user = userService.getCurrentUser();

            isValid(owner.getOwner().getId(),user.getId());

            FollowEntity followEntity = FollowEntity.builder()
                    .user(user)
                    .owner(owner)
                    .createdAt(LocalDateTime.now())
                    .build();
            followRepository.save(followEntity);
            return "Успешно";
        }catch (Exception e) {
            log.error("Не удалось создать подписку,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional()
    public String deleted(Long id) {
        try {
            followRepository.deleteById(id);
            return "Успешно";
        }catch (Exception e) {
            log.error("Не удалось удалить подписку,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private void isValid(Long ownerId, Long userId) {
        if(ownerId.equals(userId)){
            log.warn("Нельзя подписываться на себя");
            throw new RuntimeException("Нельзя подписываться на себя");
        }
    }
}
