package com.isstrack.issue_tracker.api.error;

public class UnauthorizedException extends RuntimeException {
  public UnauthorizedException(String message) {
    super(message);
  }
}
