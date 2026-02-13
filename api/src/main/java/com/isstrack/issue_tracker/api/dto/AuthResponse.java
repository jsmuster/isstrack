package com.isstrack.issue_tracker.api.dto;

public record AuthResponse(String accessToken, UserDto user) {
}
