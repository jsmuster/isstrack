package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.NotificationDto;
import com.isstrack.issue_tracker.domain.event.IssueAssignedEvent;
import java.time.Instant;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
  private final ApplicationEventPublisher eventPublisher;

  public NotificationService(ApplicationEventPublisher eventPublisher) {
    this.eventPublisher = eventPublisher;
  }

  public void issueAssigned(long assigneeUserId, long issueId, long projectId, String title) {
    var payload = new NotificationDto(
        "ISSUE_ASSIGNED",
        "You were assigned to issue " + title,
        Instant.now(),
        Map.of("issueId", issueId, "projectId", projectId)
    );
    eventPublisher.publishEvent(new IssueAssignedEvent(assigneeUserId, payload, Instant.now()));
  }
}
