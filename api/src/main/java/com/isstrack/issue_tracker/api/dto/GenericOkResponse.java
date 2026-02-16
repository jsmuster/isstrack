/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

public record GenericOkResponse(boolean ok) {
  public static GenericOkResponse success() {
    return new GenericOkResponse(true);
  }
}
