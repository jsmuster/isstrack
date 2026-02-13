package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.IssueDetailDto;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueActivityRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueCommentRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueTagRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class IssueDetailService {
  private final IssueRepository issueRepository;
  private final IssueTagRepository issueTagRepository;
  private final IssueCommentRepository commentRepository;
  private final IssueActivityRepository activityRepository;
  private final ProjectAccessService accessService;

  public IssueDetailService(
      IssueRepository issueRepository,
      IssueTagRepository issueTagRepository,
      IssueCommentRepository commentRepository,
      IssueActivityRepository activityRepository,
      ProjectAccessService accessService
  ) {
    this.issueRepository = issueRepository;
    this.issueTagRepository = issueTagRepository;
    this.commentRepository = commentRepository;
    this.activityRepository = activityRepository;
    this.accessService = accessService;
  }

  public IssueDetailDto getIssueDetail(
      long userId,
      long issueId,
      Pageable commentsPageable,
      Pageable activityPageable
  ) {
    IssueEntity issue = issueRepository.findIssueDetailById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    List<String> tags = issueTagRepository.findIssueTagsByIssueIds(List.of(issueId)).stream()
        .map(row -> Objects.toString(row[1]))
        .toList();
    IssueDto issueDto = EntityMapper.toIssueDto(issue, tags);

    var commentPage = commentRepository.findByIssueIdOrderByCreatedAtDesc(issueId, commentsPageable);
    var commentItems = commentPage.stream().map(EntityMapper::toCommentDto).toList();
    PageResponse<CommentDto> comments = new PageResponse<>(
        commentItems,
        commentPage.getNumber(),
        commentPage.getSize(),
        commentPage.getTotalElements(),
        commentPage.getTotalPages()
    );

    var activityPage = activityRepository.findByIssueIdOrderByCreatedAtDesc(issueId, activityPageable);
    var activityItems = activityPage.stream().map(EntityMapper::toActivityDto).toList();
    PageResponse<ActivityDto> activity = new PageResponse<>(
        activityItems,
        activityPage.getNumber(),
        activityPage.getSize(),
        activityPage.getTotalElements(),
        activityPage.getTotalPages()
    );

    return new IssueDetailDto(issueDto, issue.getDescription(), comments, activity);
  }
}
