package org.example.tula.chatMessages.api.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.chatMessages.api.dto.requests.CreateChatMessageRequest;
import org.example.tula.chatMessages.api.dto.responses.ChatMessageResponse;
import org.example.tula.chatMessages.domain.services.ChatMessageService;
import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Сообщения между продавцом и покупателем")
@RestController
@RequestMapping("/api/chat-message")
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @Operation(summary = "Отправить(создать) новое сообщение")
    @PostMapping("/{chat_id}")
    public ResponseEntity<ChatMessageResponse> createMessage(
            @Parameter(description = "Id чата к которому будут присваиваться сообщения")
            @PathVariable("chat_id") Long chatId,
            @RequestBody @Valid CreateChatMessageRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(chatMessageService.createMessage(chatId, request));
    }

    @Operation(summary = "Получить все сообщения чата")
    @GetMapping("/{chat_id}")
    public ResponseEntity<List<ChatMessageResponse>> getAllMessagesFromChat(
            @Parameter(description = "Id чата из которого будут браться сообщения")
            @PathVariable("chat_id") Long chatId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatMessageService.getAllMessagesFromChat(chatId));
    }

    @Operation(summary = "Получить все последнее сообщения чата")
    @GetMapping("/last-message/{chat_id}")
    public ResponseEntity<ChatMessageResponse> getLastMessageFromChat(
            @Parameter(description = "Id чата для получения из него последнего сообщения")
            @PathVariable("chat_id") Long chatId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatMessageService.getLastMessageFromChat(chatId));
    }

    @Operation(summary = "Получить все сообщения продавца из чата")
    @GetMapping("/seller/{chat_id}")
    public ResponseEntity<List<ChatMessageResponse>> getAllSellerMessagesFromChat(
            @Parameter(description = "Id чата для получения из него всех сообщений продавца")
            @PathVariable("chat_id") Long chatId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatMessageService.getAllSellerMessagesFromChat(chatId));
    }

    @Operation(summary = "Получить все сообщения покупателя из чата")
    @GetMapping("/buyer/{chat_id}")
    public ResponseEntity<List<ChatMessageResponse>> getAllBuyerMessagesFromChat(
            @Parameter(description = "Id чата для получения из него всех сообщений покупателя")
            @PathVariable("chat_id") Long chatId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatMessageService.getAllBuyerMessagesFromChat(chatId));
    }

}
