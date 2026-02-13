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
