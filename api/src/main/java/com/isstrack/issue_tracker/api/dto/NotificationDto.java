/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;
import java.util.Map;

public record NotificationDto(
    String type,
    String message,
    Instant createdAt,
    Map<String, Object> meta
) {
}

