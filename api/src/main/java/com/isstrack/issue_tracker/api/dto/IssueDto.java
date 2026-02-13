package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;
import java.util.List;

public record IssueDto(
    Long id,
    Long projectId,
    String title,
    String status,
    String priority,
    Long ownerUserId,
    Long assigneeUserId,
    List<String> tags,
    Instant updatedAt
) {
}
