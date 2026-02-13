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
