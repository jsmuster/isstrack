/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;

public record ActivityDto(
    Long id,
    Long issueId,
    Long actorUserId,
    String message,
    Instant createdAt
) {
}

