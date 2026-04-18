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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Чат между продавцом и покупателем")
@RestController
@RequestMapping("api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;

    @Operation(summary = "Создать новый чат")
    @PostMapping("/{animal_id}")
    public ResponseEntity<ChatResponse> createNewChat(
            @Parameter(description = "Id анкеты животного")
            @PathVariable("animal_id") Long animalId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(chatService.createNewChat(animalId));
    }

    @Operation(summary = "Показать все чаты")
    @GetMapping
    public ResponseEntity<List<ChatResponse>> getAllChats(
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "pageNum", required = false) Integer pageNum
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatService.getAllChatsByUser(pageSize, pageNum));
    }

    @Operation(summary = "Получить чат по id (ТОЛЬКО ПРИНАДЛЕЖАЩИЕ ТЕКУЩЕМУ ПОЛЬЗОВАТЕЛЮ!)")
    @GetMapping("/{id}")
    public ResponseEntity<ChatResponse> getChatById(
            @Parameter(description = "Id чата")
            @PathVariable("id") Long id
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(chatService.getChatById(id));
    }
}
