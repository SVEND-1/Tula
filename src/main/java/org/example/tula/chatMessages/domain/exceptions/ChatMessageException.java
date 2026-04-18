package org.example.tula.chatMessages.domain.exceptions;

public class ChatMessageException extends RuntimeException {
    public ChatMessageException(String message) {
        super(message);
    }
    public ChatMessageException(String message, Throwable cause) {
        super(message, cause);
    }
}
