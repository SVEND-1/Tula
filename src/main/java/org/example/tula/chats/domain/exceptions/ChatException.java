package org.example.tula.chats.domain.exceptions;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ChatException extends ResponseStatusException {

    public ChatException(HttpStatusCode status) {
        super(status);
    }

    public ChatException(HttpStatusCode status, String reason) {
        super(status, reason);
    }

    public ChatException(int rawStatusCode, String reason, Throwable cause) {
        super(rawStatusCode, reason, cause);
    }

    public ChatException(HttpStatusCode status, String reason, Throwable cause) {
        super(status, reason, cause);
    }

    protected ChatException(HttpStatusCode status, String reason, Throwable cause, String messageDetailCode, Object[] messageDetailArguments) {
        super(status, reason, cause, messageDetailCode, messageDetailArguments);
    }
}
