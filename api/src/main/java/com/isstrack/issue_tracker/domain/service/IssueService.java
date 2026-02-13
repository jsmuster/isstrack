package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.CreateIssueRequest;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.PatchIssueRequest;
import com.isstrack.issue_tracker.api.error.BadRequestException;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.event.IssueCreatedEvent;
import com.isstrack.issue_tracker.domain.event.IssueUpdatedEvent;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.domain.model.MembershipStatus;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueTagEntity;
import com.isstrack.issue_tracker.persistence.entity.PriorityEntity;
import com.isstrack.issue_tracker.persistence.entity.StatusEntity;
import com.isstrack.issue_tracker.persistence.entity.TagEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueTagRepository;
import com.isstrack.issue_tracker.persistence.repo.PriorityRepository;
import com.isstrack.issue_tracker.persistence.repo.ProjectMembershipRepository;
import com.isstrack.issue_tracker.persistence.repo.ProjectRepository;
import com.isstrack.issue_tracker.persistence.repo.StatusRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IssueService {
  private static final Logger log = LoggerFactory.getLogger(IssueService.class);
  private final IssueRepository issueRepository;
  private final IssueTagRepository issueTagRepository;
  private final ProjectRepository projectRepository;
  private final StatusRepository statusRepository;
  private final PriorityRepository priorityRepository;
  private final UserRepository userRepository;
  private final ProjectMembershipRepository membershipRepository;
  private final ProjectAccessService accessService;
  private final TagService tagService;
  private final ActivityService activityService;
  private final ApplicationEventPublisher eventPublisher;
  private final NotificationService notificationService;

  public IssueService(
      IssueRepository issueRepository,
      IssueTagRepository issueTagRepository,
      ProjectRepository projectRepository,
      StatusRepository statusRepository,
      PriorityRepository priorityRepository,
      UserRepository userRepository,
      ProjectMembershipRepository membershipRepository,
      ProjectAccessService accessService,
      TagService tagService,
      ActivityService activityService,
      ApplicationEventPublisher eventPublisher,
      NotificationService notificationService
  ) {
    this.issueRepository = issueRepository;
    this.issueTagRepository = issueTagRepository;
    this.projectRepository = projectRepository;
    this.statusRepository = statusRepository;
    this.priorityRepository = priorityRepository;
    this.userRepository = userRepository;
    this.membershipRepository = membershipRepository;
    this.accessService = accessService;
    this.tagService = tagService;
    this.activityService = activityService;
    this.eventPublisher = eventPublisher;
    this.notificationService = notificationService;
  }

  @Transactional
  public IssueDto createIssue(long userId, long projectId, CreateIssueRequest request) {
    accessService.requireActiveMember(userId, projectId);
    var project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("Project not found"));
    var owner = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    var status = statusRepository.findByNameIgnoreCase("OPEN")
        .orElseThrow(() -> new NotFoundException("Status not found"));
    var priority = findPriority(request.priority());
    var issue = new IssueEntity();
    issue.setProject(project);
    issue.setTitle(request.title().trim());
    issue.setDescription(request.description());
    issue.setStatus(status);
    issue.setPriority(priority);
    issue.setOwner(owner);
    if (request.assigneeUserId() != null) {
      validateAssignee(projectId, request.assigneeUserId());
      issue.setAssignee(userRepository.findById(request.assigneeUserId())
          .orElseThrow(() -> new BadRequestException("Assignee user does not exist")));
    }
    var saved = issueRepository.save(issue);
    var tags = tagService.normalizeAndSave(request.tags());
    saveIssueTags(saved, tags);
    activityService.logActivity(saved, owner, "Issue created");
    var tagNames = tags.stream().map(TagEntity::getName).toList();
    var dto = EntityMapper.toIssueDto(saved, tagNames);
    eventPublisher.publishEvent(new IssueCreatedEvent(projectId, saved.getId(), dto, Instant.now()));
    log.info("Created issue {}", saved.getId());
    return dto;
  }

  @Transactional
  public IssueDto updateIssue(long userId, long issueId, PatchIssueRequest request) {
    var issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    var actor = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));

    boolean changed = false;
    if (request.title() != null) {
      issue.setTitle(request.title().trim());
      activityService.logActivity(issue, actor, "Title updated");
      changed = true;
    }
    if (request.description() != null) {
      issue.setDescription(request.description());
      activityService.logActivity(issue, actor, "Description updated");
      changed = true;
    }
    if (request.status() != null) {
      var status = findStatus(request.status());
      issue.setStatus(status);
      activityService.logActivity(issue, actor, "Status changed to " + status.getName());
      if ("CLOSED".equalsIgnoreCase(status.getName())) {
        issue.setClosedAt(java.time.Instant.now());
      }
      changed = true;
    }
    if (request.priority() != null) {
      var priority = findPriority(request.priority());
      issue.setPriority(priority);
      activityService.logActivity(issue, actor, "Priority changed to " + priority.getName());
      changed = true;
    }
    if (Boolean.TRUE.equals(request.clearAssignee())) {
      issue.setAssignee(null);
      activityService.logActivity(issue, actor, "Assignee cleared");
      changed = true;
    } else if (request.assigneeUserId() != null) {
      validateAssignee(issue.getProject().getId(), request.assigneeUserId());
      var assignee = userRepository.findById(request.assigneeUserId())
          .orElseThrow(() -> new BadRequestException("Assignee user does not exist"));
      issue.setAssignee(assignee);
      activityService.logActivity(issue, actor, "Assignee changed to userId=" + assignee.getId());
      notificationService.issueAssigned(
          assignee.getId(),
          issue.getId(),
          issue.getProject().getId(),
          issue.getTitle()
      );
      changed = true;
    }
    List<String> tagNames = null;
    if (request.tags() != null) {
      var tags = tagService.normalizeAndSave(request.tags());
      issueTagRepository.deleteByIssue_Id(issue.getId());
      saveIssueTags(issue, tags);
      tagNames = tags.stream().map(TagEntity::getName).toList();
      activityService.logActivity(issue, actor, "Tags updated");
      changed = true;
    }

    if (!changed) {
      var tags = loadTagNames(issue.getId());
      return EntityMapper.toIssueDto(issue, tags);
    }

    var saved = issueRepository.save(issue);
    if (tagNames == null) {
      tagNames = loadTagNames(issue.getId());
    }
    var dto = EntityMapper.toIssueDto(saved, tagNames);
    eventPublisher.publishEvent(new IssueUpdatedEvent(saved.getProject().getId(), saved.getId(), dto, Instant.now()));
    log.info("Updated issue {}", saved.getId());
    return dto;
  }

  private StatusEntity findStatus(String statusName) {
    return statusRepository.findByNameIgnoreCase(statusName)
        .orElseThrow(() -> new BadRequestException("Invalid status"));
  }

  private PriorityEntity findPriority(String priorityName) {
    return priorityRepository.findByNameIgnoreCase(priorityName)
        .orElseThrow(() -> new BadRequestException("Invalid priority"));
  }

  public void validateAssignee(long projectId, Long assigneeUserId) {
    if (!userRepository.existsById(assigneeUserId)) {
      throw new BadRequestException("Assignee user does not exist");
    }
    boolean member = membershipRepository.existsByProjectIdAndUserIdAndStatus(
        projectId,
        assigneeUserId,
        MembershipStatus.ACTIVE.name()
    );
    if (!member) {
      throw new BadRequestException("Assignee must be an active member of the project");
    }
  }

  private void saveIssueTags(IssueEntity issue, List<TagEntity> tags) {
    Set<IssueTagEntity> entities = new HashSet<>();
    for (var tag : tags) {
      var join = new IssueTagEntity();
      join.setIssue(issue);
      join.setTag(tag);
      join.setId(new IssueTagEntity.IssueTagId(issue.getId(), tag.getId()));
      entities.add(join);
    }
    issueTagRepository.saveAll(entities);
    issue.setIssueTags(entities);
  }

  private List<String> loadTagNames(Long issueId) {
    return issueTagRepository.findIssueTagsByIssueIds(List.of(issueId)).stream()
        .map(row -> Objects.toString(row[1]))
        .toList();
  }

}
