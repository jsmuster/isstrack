package com.isstrack.issue_tracker.domain.event;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
public class WebSocketBroadcaster {
  private final SimpMessagingTemplate messagingTemplate;

  public WebSocketBroadcaster(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void onEvent(DomainEvent event) {
    switch (event) {
      case IssueCreatedEvent ev ->
          messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      case IssueUpdatedEvent ev ->
          messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      case MemberAddedEvent ev ->
          messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      case CommentAddedEvent ev ->
          messagingTemplate.convertAndSend("/topic/issues." + ev.issueId(), ev.payload());
      case ActivityLoggedEvent ev ->
          messagingTemplate.convertAndSend("/topic/issues." + ev.issueId(), ev.payload());
      case IssueAssignedEvent ev ->
          messagingTemplate.convertAndSendToUser(
              String.valueOf(ev.assigneeUserId()),
              "/queue/notifications",
              ev.payload()
          );
      default -> {
      }
    }
  }
}
