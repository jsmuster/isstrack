/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;

public record ProjectDto(
    Long id,
    String name,
    String prefix,
    Long ownerUserId,
    String ownerEmail,
    Instant createdAt,
    Instant updatedAt
) {
}

