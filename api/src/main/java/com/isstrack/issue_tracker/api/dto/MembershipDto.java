/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;

public record MembershipDto(
    Long id,
    Long projectId,
    Long userId,
    String invitedEmail,
    String role,
    String status,
    Instant createdAt
) {
}

