package org.example.tula.chats.api.dto.responses;

import org.example.tula.animals.api.dto.responses.AnimalResponseForChat;
import org.example.tula.users.api.dto.users.response.UserDefaultResponse;

public record ChatResponseForMessages(
        Long id,
        UserDefaultResponse seller,
        UserDefaultResponse buyer,
        AnimalResponseForChat animal
) {
}
