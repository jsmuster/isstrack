/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public record PatchIssueRequest(
    @Size(max = 200) String title,
    @Size(max = 20000) String description,
    String status,
    String priority,
    Long assigneeUserId,
    Boolean clearAssignee,
    List<String> tags
) {
}

