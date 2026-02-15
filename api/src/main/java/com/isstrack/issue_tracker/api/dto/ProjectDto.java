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
