/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.repo.IssueActivityRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityQueryService {
  private final IssueActivityRepository activityRepository;
  private final IssueRepository issueRepository;
  private final ProjectAccessService accessService;

  public ActivityQueryService(
      IssueActivityRepository activityRepository,
      IssueRepository issueRepository,
      ProjectAccessService accessService
  ) {
    this.activityRepository = activityRepository;
    this.issueRepository = issueRepository;
    this.accessService = accessService;
  }

  @Transactional(readOnly = true)
  public PageResponse<ActivityDto> listActivity(long userId, long issueId, Pageable pageable) {
    var issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new NotFoundException("Issue not found"));
    accessService.requireActiveMember(userId, issue.getProject().getId());
    var page = activityRepository.findByIssueIdOrderByCreatedAtDesc(issueId, pageable);
    var items = page.stream().map(EntityMapper::toActivityDto).toList();
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }
}

