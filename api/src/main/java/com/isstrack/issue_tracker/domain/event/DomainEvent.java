package com.isstrack.issue_tracker.domain.event;

import java.time.Instant;

public interface DomainEvent {
  Instant occurredAt();
}
