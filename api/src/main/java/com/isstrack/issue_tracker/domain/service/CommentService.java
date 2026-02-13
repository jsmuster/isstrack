package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.event.CommentAddedEvent;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.entity.IssueCommentEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueCommentRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.time.Instant;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {
  private final IssueCommentRepository commentRepository;
  private final IssueRepository issueRepository;
  private final UserRepository userRepository;
  private final ProjectAccessService accessService;
  private final ActivityService activityService;
  private final ApplicationEventPublisher eventPublisher;

  public CommentService(
      IssueCommentRepository commentRepository,
      IssueRepository issueRepository,
      UserRepository userRepository,
      ProjectAccessService accessService,
      ActivityService activityService,
      ApplicationEventPublisher eventPublisher
  ) {
    this.commentRepository = commentRepository;
    this.issueRepository = issueRepository;
    this.userRepository = userRepository;
    this.accessService = accessService;
    this.activityService = activityService;
    this.eventPublisher = eventPublisher;
  }

  @Transactional
  public CommentDto addComment(long userId, long issueId, String body) {
    var issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    var author = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    var comment = new IssueCommentEntity();
    comment.setIssue(issue);
    comment.setAuthor(author);
    comment.setBody(body.trim());
    var saved = commentRepository.save(comment);
    var dto = EntityMapper.toCommentDto(saved);
    eventPublisher.publishEvent(new CommentAddedEvent(issueId, dto, Instant.now()));
    activityService.logActivity(issue, author, "Comment added");
    return dto;
  }

  public PageResponse<CommentDto> listComments(long userId, long issueId, Pageable pageable) {
    var issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    var page = commentRepository.findByIssueIdOrderByCreatedAtDesc(issueId, pageable);
    var items = page.stream().map(EntityMapper::toCommentDto).toList();
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }
}
