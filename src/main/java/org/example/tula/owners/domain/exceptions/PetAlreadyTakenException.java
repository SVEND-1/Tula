package org.example.tula.owners.domain.exceptions;

public class PetAlreadyTakenException extends RuntimeException {
    public PetAlreadyTakenException(String message) {
        super(message);
    }
}
