package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;

public record CommentDto(
    Long id,
    Long issueId,
    Long authorUserId,
    String body,
    Instant createdAt
) {
}
