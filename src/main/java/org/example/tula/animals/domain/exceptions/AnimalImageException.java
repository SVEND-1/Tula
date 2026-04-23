package org.example.tula.animals.domain.exceptions;

public class AnimalImageException extends RuntimeException {
    public AnimalImageException(String message) {
        super(message);
    }
    public AnimalImageException(String message, Throwable cause) {
        super(message, cause);
    }
}
