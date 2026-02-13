package com.isstrack.issue_tracker.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AcceptInviteRequest(@NotBlank String token) {
}
