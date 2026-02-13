package com.isstrack.issue_tracker.api.dto;

import java.util.List;

public record PageResponse<T>(
    List<T> items,
    int page,
    int size,
    long totalElements,
    int totalPages
) {
}
