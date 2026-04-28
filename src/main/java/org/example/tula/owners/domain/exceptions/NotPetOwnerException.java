package org.example.tula.owners.domain.exceptions;

public class NotPetOwnerException extends RuntimeException {
    public NotPetOwnerException(String message) {
        super(message);
    }
}
