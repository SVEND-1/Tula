package org.example.tula.chatMessages.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.chatMessages.api.dto.requests.CreateChatMessageRequest;
import org.example.tula.chatMessages.api.dto.requests.GetAllChatMessagesRequest;
import org.example.tula.chatMessages.api.dto.responses.ChatMessageResponse;
import org.example.tula.chatMessages.db.entities.ChatMessageEntity;
import org.example.tula.chatMessages.db.enums.SenderType;
import org.example.tula.chatMessages.db.repositories.ChatMessageRepository;
import org.example.tula.chatMessages.domain.mappers.ChatMessageMapper;
import org.example.tula.chats.db.entities.ChatEntity;
import org.example.tula.chats.domain.services.ChatService;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatService chatService;
    private final UserService userService;

    //====================================CONTROLLER METHODS=======================================================


    public ChatMessageResponse createMessage(
            Long chatId,
            CreateChatMessageRequest request
    ) {
        log.info("Creating a new message for chat with id {}", chatId);
        UserEntity currentUser = userService.getCurrentUser();
        ChatEntity chatEntity =
                chatService.getChatByIdWithCheckUser(chatId, currentUser);

        chatService.checkChatStatus(chatEntity);

        ChatMessageEntity messageEntity = ChatMessageEntity.builder()
                .chat(chatEntity)
                .sender(currentUser)
                .senderType(getSenderTypeFromChat(currentUser, chatEntity))
                .message(request.message())
                .build();

        ChatMessageEntity savedMessage = chatMessageRepository.save(messageEntity);
        log.debug("Created a new message for chat with id {}", chatId);
        return chatMessageMapper.convertEntityToResponse(savedMessage);
    }

    public List<ChatMessageResponse> getAllMessagesFromChat(GetAllChatMessagesRequest request) {
        log.info("Getting all messages from chat");
        UserEntity currentUser = userService.getCurrentUser();
        ChatEntity chatEntity =
                chatService.getChatByIdWithCheckUser(request.chatId(), currentUser);
        Pageable pageable = assemblePageable(request.pageSize(), request.pageNum());

        List<ChatMessageEntity> messagesFromChat =
                chatMessageRepository.findAllByChat(chatEntity, pageable);
        log.debug("Found {} messages from chat", messagesFromChat.size());

        return chatMessageMapper.convertEntityListToResponseList(messagesFromChat);
    }

    public ChatMessageResponse getLastMessageFromChat(Long chatId) {
        log.info("Getting last message from chat with id {}", chatId);
        UserEntity currentUser = userService.getCurrentUser();
        ChatEntity chatEntity =
                chatService.getChatByIdWithCheckUser(chatId, currentUser);

        ChatMessageEntity lastMessage = chatMessageRepository.findLastMessageByChat(chatEntity);
        log.debug("Found last message from chat with id {}", lastMessage.getId());

        return chatMessageMapper.convertEntityToResponse(lastMessage);
    }

    public List<ChatMessageResponse> getAllSellerMessagesFromChat(GetAllChatMessagesRequest request) {
        log.info("Getting all sellers messages from chat with id {}", request.chatId());
        UserEntity currentUser = userService.getCurrentUser();
        ChatEntity chatEntity =
                chatService.getChatByIdWithCheckUser(request.chatId(), currentUser);
        Pageable pageable = assemblePageable(request.pageSize(), request.pageNum());

        List<ChatMessageEntity> sellerMessages =
                chatMessageRepository.findAllByChatAndSenderType(chatEntity, SenderType.SELLER, pageable);
        log.debug("Found {} sellers messages from chat", sellerMessages.size());

        return chatMessageMapper.convertEntityListToResponseList(sellerMessages);
    }

    public List<ChatMessageResponse> getAllBuyerMessagesFromChat(GetAllChatMessagesRequest request) {
        log.info("Getting all buyers messages from chat with id {}", request.chatId());
        UserEntity currentUser = userService.getCurrentUser();
        ChatEntity chatEntity =
                chatService.getChatByIdWithCheckUser(request.chatId(), currentUser);
        Pageable pageable = assemblePageable(request.pageSize(), request.pageNum());

        log.info("gok");

        List<ChatMessageEntity> buyerMessages =
                chatMessageRepository.findAllByChatAndSenderType(chatEntity, SenderType.BUYER, pageable);
        log.debug("Found {} buyers messages from chat", buyerMessages.size());

        return chatMessageMapper.convertEntityListToResponseList(buyerMessages);
    }

    //====================================SERVICE METHODS=======================================================

    private SenderType getSenderTypeFromChat(UserEntity currentUser, ChatEntity chatEntity) {
        log.debug("Getting sender type from chat with id {}", chatEntity.getId());
        if (chatEntity.getSeller().getId().equals(currentUser.getId())) {
            return SenderType.SELLER;
        }

        return SenderType.BUYER;
    }

    private Pageable assemblePageable(Integer pageSize, Integer pageNum) {
        int pageSizeForPageable = pageSize == null || pageSize == 0 ? 5 : pageSize;
        int pageNumForPageable = pageNum == null ? 0 : pageNum;
        return Pageable
                .ofSize(pageSizeForPageable)
                .withPage(pageNumForPageable);
    }
}
