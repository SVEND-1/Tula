package org.example.tula.chatMessages.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.chatMessages.api.dto.requests.CreateChatMessageRequest;
import org.example.tula.chatMessages.api.dto.responses.ChatMessageResponse;
import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageService {
    public ChatMessageResponse createMessage(Long chatId, CreateChatMessageRequest request) {
        return null;
    }

    public List<ChatMessageResponse> getAllMessagesFromChat(Long chatId) {
        return null;
    }

    public ChatMessageResponse getLastMessageFromChat(Long chatId) {
        return null;
    }

    public List<ChatMessageResponse> getAllSellerMessagesFromChat(Long chatId) {
        return null;
    }

    public List<ChatMessageResponse> getAllBuyerMessagesFromChat(Long chatId) {
        return null;
    }
}
