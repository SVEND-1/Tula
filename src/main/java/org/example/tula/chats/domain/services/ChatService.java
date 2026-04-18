package org.example.tula.chats.domain.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.AnimalRepository;
import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.example.tula.chats.db.entities.ChatEntity;
import org.example.tula.chats.db.repositories.ChatRepository;
import org.example.tula.chats.domain.exceptions.ChatException;
import org.example.tula.chats.domain.mappers.ChatMapper;
import org.example.tula.users.db.Role;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.db.UserRepository;
import org.example.tula.users.domain.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final AnimalRepository animalRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    //====================================CONTROLLER METHODS=======================================================

    public ChatResponse createNewChat(Long animalId) {
        log.info("Creating a new chat for animal profile with id {}", animalId);
        UserEntity currentUser = userService.getCurrentUser();
        checkUserRoleIsUser(currentUser);

        AnimalEntity animalEntity = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal with id " + animalId + " not found"));
        UserEntity sellerUser = animalEntity.getOwner();

        ChatEntity chatEntity = ChatEntity.builder()
                .seller(sellerUser)
                .buyer(currentUser)
                .animal(animalEntity)
                .build();

        ChatEntity savedChat = chatRepository.save(chatEntity);
        log.debug("Created new chat with id {}", chatEntity.getId());
        return chatMapper.convertEntityToResponse(savedChat);
    }

    //====================================SERVICE METHODS=======================================================
    private void checkUserRoleIsUser(UserEntity currentUser) {
        if (!currentUser.getRole().equals(Role.USER)) {
            throw new ChatException(HttpStatus.BAD_REQUEST, "Only users can create new chat");
        }
    }
}
