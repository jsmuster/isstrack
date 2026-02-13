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
    if (event instanceof IssueCreatedEvent ev) {
      messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      return;
    }
    if (event instanceof IssueUpdatedEvent ev) {
      messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      return;
    }
    if (event instanceof MemberAddedEvent ev) {
      messagingTemplate.convertAndSend("/topic/projects." + ev.projectId(), ev.payload());
      return;
    }
    if (event instanceof CommentAddedEvent ev) {
      messagingTemplate.convertAndSend("/topic/issues." + ev.issueId(), ev.payload());
      return;
    }
    if (event instanceof ActivityLoggedEvent ev) {
      messagingTemplate.convertAndSend("/topic/issues." + ev.issueId(), ev.payload());
      return;
    }
    if (event instanceof IssueAssignedEvent ev) {
      messagingTemplate.convertAndSendToUser(
          String.valueOf(ev.assigneeUserId()),
          "/queue/notifications",
          ev.payload()
      );
    }
  }
}
