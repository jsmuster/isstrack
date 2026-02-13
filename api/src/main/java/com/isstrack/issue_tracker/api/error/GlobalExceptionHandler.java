package com.isstrack.issue_tracker.api.error;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest request) {
    return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ApiError> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
    return buildError(HttpStatus.FORBIDDEN, ex.getMessage(), request);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ApiError> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
    return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
    return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    var message = ex.getBindingResult().getAllErrors().stream()
        .findFirst()
        .map(error -> {
          if (error instanceof FieldError fieldError) {
            return fieldError.getField() + " " + fieldError.getDefaultMessage();
          }
          return error.getDefaultMessage();
        })
        .orElse("Validation failed");
    return buildError(HttpStatus.BAD_REQUEST, message, request);
  }

  @ExceptionHandler(OptimisticLockingFailureException.class)
  public ResponseEntity<ApiError> handleOptimistic(OptimisticLockingFailureException ex, HttpServletRequest request) {
    return buildError(HttpStatus.CONFLICT, "Conflict", request);
  }

  private ResponseEntity<ApiError> buildError(HttpStatus status, String message, HttpServletRequest request) {
    var error = new ApiError(
        Instant.now(),
        status.value(),
        status.getReasonPhrase(),
        message,
        request.getRequestURI()
    );
    return ResponseEntity.status(status).body(error);
  }
}
