package com.isstrack.issue_tracker.domain.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.isstrack.issue_tracker.api.dto.PatchIssueRequest;
import com.isstrack.issue_tracker.api.error.BadRequestException;
import com.isstrack.issue_tracker.domain.event.IssueUpdatedEvent;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.entity.PriorityEntity;
import com.isstrack.issue_tracker.persistence.entity.ProjectEntity;
import com.isstrack.issue_tracker.persistence.entity.StatusEntity;
import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueTagRepository;
import com.isstrack.issue_tracker.persistence.repo.PriorityRepository;
import com.isstrack.issue_tracker.persistence.repo.ProjectMembershipRepository;
import com.isstrack.issue_tracker.persistence.repo.ProjectRepository;
import com.isstrack.issue_tracker.persistence.repo.StatusRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;

class IssueServiceTest {
  @Test
  void assigneeValidationRequiresActiveMember() {
    IssueRepository issueRepository = Mockito.mock(IssueRepository.class);
    IssueTagRepository issueTagRepository = Mockito.mock(IssueTagRepository.class);
    ProjectRepository projectRepository = Mockito.mock(ProjectRepository.class);
    StatusRepository statusRepository = Mockito.mock(StatusRepository.class);
    PriorityRepository priorityRepository = Mockito.mock(PriorityRepository.class);
    UserRepository userRepository = Mockito.mock(UserRepository.class);
    ProjectMembershipRepository membershipRepository = Mockito.mock(ProjectMembershipRepository.class);
    ProjectAccessService accessService = Mockito.mock(ProjectAccessService.class);
    TagService tagService = Mockito.mock(TagService.class);
    ActivityService activityService = Mockito.mock(ActivityService.class);
    ApplicationEventPublisher publisher = Mockito.mock(ApplicationEventPublisher.class);
    NotificationService notificationService = Mockito.mock(NotificationService.class);

    IssueService service = new IssueService(
        issueRepository,
        issueTagRepository,
        projectRepository,
        statusRepository,
        priorityRepository,
        userRepository,
        membershipRepository,
        accessService,
        tagService,
        activityService,
        publisher,
        notificationService
    );

    when(userRepository.existsById(55L)).thenReturn(true);
    when(membershipRepository.existsByProjectIdAndUserIdAndStatus(10L, 55L, "ACTIVE")).thenReturn(false);

    BadRequestException ex = assertThrows(BadRequestException.class, () ->
        service.validateAssignee(10L, 55L)
    );
    assertEquals("Assignee must be an active member of the project", ex.getMessage());
  }

  @Test
  void updateIssueLogsStatusChangeActivity() {
    IssueRepository issueRepository = Mockito.mock(IssueRepository.class);
    IssueTagRepository issueTagRepository = Mockito.mock(IssueTagRepository.class);
    ProjectRepository projectRepository = Mockito.mock(ProjectRepository.class);
    StatusRepository statusRepository = Mockito.mock(StatusRepository.class);
    PriorityRepository priorityRepository = Mockito.mock(PriorityRepository.class);
    UserRepository userRepository = Mockito.mock(UserRepository.class);
    ProjectMembershipRepository membershipRepository = Mockito.mock(ProjectMembershipRepository.class);
    ProjectAccessService accessService = Mockito.mock(ProjectAccessService.class);
    TagService tagService = Mockito.mock(TagService.class);
    ActivityService activityService = Mockito.mock(ActivityService.class);
    ApplicationEventPublisher publisher = Mockito.mock(ApplicationEventPublisher.class);
    NotificationService notificationService = Mockito.mock(NotificationService.class);

    IssueService service = new IssueService(
        issueRepository,
        issueTagRepository,
        projectRepository,
        statusRepository,
        priorityRepository,
        userRepository,
        membershipRepository,
        accessService,
        tagService,
        activityService,
        publisher,
        notificationService
    );

    var project = new ProjectEntity();
    project.setId(10L);
    var status = new StatusEntity();
    status.setName("OPEN");
    var priority = new PriorityEntity();
    priority.setName("LOW");
    var issue = new IssueEntity();
    issue.setId(1L);
    issue.setProject(project);
    issue.setStatus(status);
    issue.setPriority(priority);
    issue.setTitle("Issue");
    var owner = new UserEntity();
    owner.setId(50L);
    issue.setOwner(owner);
    var actor = new UserEntity();
    actor.setId(99L);

    when(issueRepository.findById(1L)).thenReturn(Optional.of(issue));
    when(userRepository.findById(99L)).thenReturn(Optional.of(actor));
    StatusEntity inProgress = new StatusEntity();
    inProgress.setName("IN_PROGRESS");
    when(statusRepository.findByNameIgnoreCase("IN_PROGRESS"))
        .thenReturn(Optional.of(inProgress));
    when(issueRepository.save(issue)).thenReturn(issue);

    PatchIssueRequest request = new PatchIssueRequest(null, null, "IN_PROGRESS", null, null, null, null);
    service.updateIssue(99L, 1L, request);

    verify(activityService).logActivity(issue, actor, "Status changed to IN_PROGRESS");
    ArgumentCaptor<IssueUpdatedEvent> captor = ArgumentCaptor.forClass(IssueUpdatedEvent.class);
    verify(publisher).publishEvent(captor.capture());
  }
}
