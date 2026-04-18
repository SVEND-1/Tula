package org.example.tula.chats.api.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.example.tula.chats.domain.services.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Чат между продавцом и покупателем")
@RestController
@RequestMapping("api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    ChatService chatService;

    @Operation(summary = "Создать новый чат")
    @PostMapping
    public ResponseEntity<ChatResponse> createNewChat(
            @Parameter(description = "Id анкеты животного")
            @PathVariable("/{animal_id}") Long animalId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(chatService.createNewChat(animalId));
    }

}
