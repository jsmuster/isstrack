/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.error.ForbiddenException;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.event.CommentAddedEvent;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.entity.IssueCommentEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
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

  @Transactional(readOnly = true)
  public PageResponse<CommentDto> listComments(long userId, long issueId, Pageable pageable) {
    var issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    var page = commentRepository.findByIssueIdOrderByCreatedAtDesc(issueId, pageable);
    var items = page.stream().map(EntityMapper::toCommentDto).toList();
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }

  @Transactional
  public CommentDto updateComment(long userId, long issueId, long commentId, String body) {
    var comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new NotFoundException("Comment not found"));
    var issue = loadIssueForComment(issueId, comment);
    accessService.requireActiveMember(userId, issue.getProject().getId());
    if (!canManageComment(userId, issue, comment)) {
      throw new ForbiddenException("Not allowed to edit this comment");
    }
    var actor = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    comment.setBody(body.trim());
    var saved = commentRepository.save(comment);
    activityService.logActivity(issue, actor, "Comment edited");
    return EntityMapper.toCommentDto(saved);
  }

  @Transactional
  public void deleteComment(long userId, long issueId, long commentId) {
    var comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new NotFoundException("Comment not found"));
    var issue = loadIssueForComment(issueId, comment);
    accessService.requireActiveMember(userId, issue.getProject().getId());
    if (!canManageComment(userId, issue, comment)) {
      throw new ForbiddenException("Not allowed to delete this comment");
    }
    var actor = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    commentRepository.delete(comment);
    activityService.logActivity(issue, actor, "Comment deleted");
  }

  private IssueEntity loadIssueForComment(long issueId, IssueCommentEntity comment) {
    var issue = comment.getIssue();
    if (issue == null || !issue.getId().equals(issueId)) {
      throw new NotFoundException("Comment not found");
    }
    return issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
  }

  private boolean canManageComment(long userId, IssueEntity issue, IssueCommentEntity comment) {
    if (comment.getAuthor().getId().equals(userId)) {
      return true;
    }
    return issue.getOwner().getId().equals(userId);
  }
}

