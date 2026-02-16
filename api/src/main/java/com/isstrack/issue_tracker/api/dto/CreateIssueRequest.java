/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateIssueRequest(
    @NotBlank @Size(max = 200) String title,
    @Size(max = 20000) String description,
    @NotBlank String priority,
    Long assigneeUserId,
    List<String> tags
) {
}

