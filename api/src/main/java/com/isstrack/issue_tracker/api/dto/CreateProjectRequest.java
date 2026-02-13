package com.isstrack.issue_tracker.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(@NotBlank @Size(max = 255) String name) {
}
