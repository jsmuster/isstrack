/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import java.time.Instant;
import java.util.List;

public record IssueDto(
    Long id,
    Long projectId,
    Integer issueNumber,
    String issueKey,
    String title,
    String status,
    String priority,
    Long ownerUserId,
    Long assigneeUserId,
    List<String> tags,
    Instant updatedAt
) {
}

