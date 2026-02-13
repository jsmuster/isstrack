package com.isstrack.issue_tracker.domain.event;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import java.time.Instant;

public record ActivityLoggedEvent(Long issueId, ActivityDto payload, Instant occurredAt) implements DomainEvent {
}
