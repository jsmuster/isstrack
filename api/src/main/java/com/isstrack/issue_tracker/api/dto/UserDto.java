/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

public record UserDto(
    Long id,
    String email,
    String username,
    String firstName,
    String lastName,
    String role
) {
}

