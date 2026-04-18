package org.example.tula.users.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.owners.domain.OwnerService;
import org.example.tula.users.api.dto.users.response.UserProfileResponse;
import org.example.tula.users.domain.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> profile() {
        return ResponseEntity.ok(userService.profile());
    }
}
