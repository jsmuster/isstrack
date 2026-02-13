package com.isstrack.issue_tracker.api.error;

public class ForbiddenException extends RuntimeException {
  public ForbiddenException(String message) {
    super(message);
  }
}
