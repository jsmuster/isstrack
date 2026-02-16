/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

public record IssueDetailDto(
    IssueDto issue,
    String description,
    PageResponse<CommentDto> comments,
    PageResponse<ActivityDto> activity
) {
}

