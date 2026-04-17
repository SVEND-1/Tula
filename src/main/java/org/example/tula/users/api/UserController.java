package org.example.tula.users.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.users.domain.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
}
