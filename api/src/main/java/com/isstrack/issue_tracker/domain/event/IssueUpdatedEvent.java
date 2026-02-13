package com.isstrack.issue_tracker.domain.event;

import com.isstrack.issue_tracker.api.dto.IssueDto;
import java.time.Instant;

public record IssueUpdatedEvent(Long projectId, Long issueId, IssueDto payload, Instant occurredAt)
    implements DomainEvent {
}
