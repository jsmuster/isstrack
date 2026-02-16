/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.error;

public class BadRequestException extends RuntimeException {
  public BadRequestException(String message) {
    super(message);
  }
}

