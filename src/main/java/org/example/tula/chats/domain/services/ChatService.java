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
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.db.UserRepository;
import org.example.tula.users.domain.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

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

        AnimalEntity animalEntity = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal with id " + animalId + " not found"));
        UserEntity sellerUser = animalEntity.getOwner().getOwner();

        checkAnimalIsNotCurrentUser(currentUser, sellerUser);
        checkChatIsNotAlreadyExist(currentUser, animalEntity);

        ChatEntity chatEntity = ChatEntity.builder()
                .seller(sellerUser)
                .buyer(currentUser)
                .animal(animalEntity)
                .build();

        ChatEntity savedChat = chatRepository.save(chatEntity);
        log.debug("Created new chat with id {}", chatEntity.getId());
        return chatMapper.convertEntityToResponse(savedChat);
    }

    public List<ChatResponse> getAllChatsByUser(
            Integer pageSize,
            Integer pageNum
    ) {
        log.info("Getting all chats by user");
        UserEntity currentUser = userService.getCurrentUser();
        Pageable pageable = assemblePageable(pageSize, pageNum);

        List<ChatEntity> chatEntities = chatRepository.findAllByUserId(currentUser.getId(), pageable);
        log.debug("Found {} chats", chatEntities.size());

        return chatMapper.convertEntityListToResponseList(chatEntities);
    }

    public ChatResponse getChatById(Long id) {
        log.info("Getting chat with id {}", id);
        UserEntity currentUser = userService.getCurrentUser();

        ChatEntity chatEntity = getChatByIdWithCheckUser(id, currentUser);
        log.debug("Found chat with id {}", chatEntity.getId());

        return chatMapper.convertEntityToResponse(chatEntity);
    }

    //====================================SERVICE METHODS=======================================================
    private void checkAnimalIsNotCurrentUser(UserEntity currentUser, UserEntity sellerUser) {
        if (currentUser.getId().equals(sellerUser.getId())) {
            throw new ChatException("You cannot create a new chat for yourself");
        }
    }

    private void checkChatIsNotAlreadyExist(
            UserEntity currentUser,
            AnimalEntity animalEntity
    ) {
        if (chatRepository.existsChat(currentUser, animalEntity)) {
            throw new ChatException("You already have chat by this animal");
        }
    }

    private Pageable assemblePageable(Integer pageSize, Integer pageNum) {
        int pageSizeForPageable = pageSize == null ? 5 : pageSize;
        int pageNumForPageable = pageNum == null ? 0 : pageNum;
        return Pageable
                .ofSize(pageSizeForPageable)
                .withPage(pageNumForPageable);
    }

    private void checkForCurrentUser(
            ChatEntity chatEntity,
            UserEntity currentUser
    ) {
        log.debug("Checking for current user");
        if (!chatEntity.getSeller().getId().equals(currentUser.getId()) &&
                (!chatEntity.getBuyer().getId().equals(currentUser.getId()))) {
            throw new ChatException("It's not your chat");
        }
    }

    //====================================METHODS FOR OTHER SERVICES=======================================================

    public ChatEntity getChatByIdWithCheckUser(Long id, UserEntity currentUser) {
        log.debug("Getting chat with id {}", id);
        ChatEntity chatEntity = chatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Chat with id " + id + " not found"));

        checkForCurrentUser(chatEntity, currentUser);

        return chatEntity;
    }
}
