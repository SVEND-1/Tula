package org.example.tula.users.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.owners.domain.OwnerService;
import org.example.tula.users.api.dto.users.response.UserProfileResponse;
import org.example.tula.users.domain.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Управление пользователями")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Получение профиля пользователя")
    @GetMapping
    public ResponseEntity<UserProfileResponse> profile() {
        return ResponseEntity.ok(userService.profile());
    }
}
