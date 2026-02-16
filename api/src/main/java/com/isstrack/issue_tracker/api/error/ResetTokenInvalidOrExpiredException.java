/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.error;

public class ResetTokenInvalidOrExpiredException extends RuntimeException {
  public ResetTokenInvalidOrExpiredException(String message) {
    super(message);
  }
}
