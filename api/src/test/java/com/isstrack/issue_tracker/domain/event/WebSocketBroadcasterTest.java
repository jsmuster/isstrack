package com.isstrack.issue_tracker.domain.event;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.MembershipDto;
import com.isstrack.issue_tracker.api.dto.NotificationDto;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;

class WebSocketBroadcasterTest {
  @Test
  void routesEventsToExpectedTopics() {
    SimpMessagingTemplate template = Mockito.mock(SimpMessagingTemplate.class);
    WebSocketBroadcaster broadcaster = new WebSocketBroadcaster(template);

    IssueDto issueDto = new IssueDto(1L, 10L, "Title", "OPEN", "HIGH", 2L, null, List.of(), Instant.now());
    broadcaster.onEvent(new IssueCreatedEvent(10L, 1L, issueDto, Instant.now()));
    Mockito.verify(template).convertAndSend("/topic/projects.10", issueDto);

    CommentDto commentDto = new CommentDto(5L, 1L, 2L, "Hi", Instant.now());
    broadcaster.onEvent(new CommentAddedEvent(1L, commentDto, Instant.now()));
    Mockito.verify(template).convertAndSend("/topic/issues.1", commentDto);

    ActivityDto activityDto = new ActivityDto(6L, 1L, 2L, "Issue created", Instant.now());
    broadcaster.onEvent(new ActivityLoggedEvent(1L, activityDto, Instant.now()));
    Mockito.verify(template).convertAndSend("/topic/issues.1", activityDto);

    MembershipDto membershipDto = new MembershipDto(7L, 10L, 2L, null, "MEMBER", "ACTIVE", Instant.now());
    broadcaster.onEvent(new MemberAddedEvent(10L, membershipDto, Instant.now()));
    Mockito.verify(template).convertAndSend("/topic/projects.10", membershipDto);

    NotificationDto notificationDto = new NotificationDto("ISSUE_ASSIGNED", "Assigned", Instant.now(), Map.of());
    broadcaster.onEvent(new IssueAssignedEvent(99L, notificationDto, Instant.now()));
    Mockito.verify(template).convertAndSendToUser("99", "/queue/notifications", notificationDto);
  }
}
