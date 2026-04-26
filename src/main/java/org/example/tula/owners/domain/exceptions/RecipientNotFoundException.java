package org.example.tula.owners.domain.exceptions;

public class RecipientNotFoundException extends RuntimeException {
  public RecipientNotFoundException(String message) {
    super(message);
  }
}
