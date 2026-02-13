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
