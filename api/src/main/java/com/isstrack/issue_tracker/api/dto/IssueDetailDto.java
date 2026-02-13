package com.isstrack.issue_tracker.api.dto;

public record IssueDetailDto(
    IssueDto issue,
    String description,
    PageResponse<CommentDto> comments,
    PageResponse<ActivityDto> activity
) {
}
