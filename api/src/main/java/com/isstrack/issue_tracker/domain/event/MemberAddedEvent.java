package com.isstrack.issue_tracker.domain.event;

import com.isstrack.issue_tracker.api.dto.MembershipDto;
import java.time.Instant;

public record MemberAddedEvent(Long projectId, MembershipDto payload, Instant occurredAt) implements DomainEvent {
}
