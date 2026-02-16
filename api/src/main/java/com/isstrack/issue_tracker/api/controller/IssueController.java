/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.CreateIssueRequest;
import com.isstrack.issue_tracker.api.dto.IssueDetailDto;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.dto.PatchIssueRequest;
import com.isstrack.issue_tracker.domain.security.CurrentUser;
import com.isstrack.issue_tracker.domain.service.IssueDetailService;
import com.isstrack.issue_tracker.domain.service.IssueQueryService;
import com.isstrack.issue_tracker.domain.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class IssueController {
  private final IssueService issueService;
  private final IssueQueryService issueQueryService;
  private final IssueDetailService issueDetailService;

  public IssueController(
      IssueService issueService,
      IssueQueryService issueQueryService,
      IssueDetailService issueDetailService
  ) {
    this.issueService = issueService;
    this.issueQueryService = issueQueryService;
    this.issueDetailService = issueDetailService;
  }

  @PostMapping("/projects/{projectId}/issues")
  public IssueDto createIssue(
      @PathVariable long projectId,
      @Valid @RequestBody CreateIssueRequest request
  ) {
    long userId = CurrentUser.requireUserId();
    return issueService.createIssue(userId, projectId, request);
  }

  @GetMapping("/projects/{projectId}/issues")
  public PageResponse<IssueDto> listIssues(
      @PathVariable long projectId,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String priority,
      @RequestParam(required = false) Long assigneeId,
      @RequestParam(required = false) String tag,
      @RequestParam(required = false, name = "q") String query,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String sort
  ) {
    long userId = CurrentUser.requireUserId();
    var sortOrder = com.isstrack.issue_tracker.util.SortValidator.validateOrDefault(
        sort,
        java.util.Set.of("updatedAt", "createdAt", "title"),
        Sort.by("updatedAt").descending()
    );
    Pageable pageable = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(page, size, sortOrder);
    return issueQueryService.listIssues(userId, projectId, status, priority, assigneeId, tag, query, pageable);
  }

  @GetMapping("/issues/{issueId}")
  public IssueDetailDto getIssueDetail(
      @PathVariable long issueId,
      @RequestParam(defaultValue = "0") int commentsPage,
      @RequestParam(defaultValue = "20") int commentsSize,
      @RequestParam(defaultValue = "0") int activityPage,
      @RequestParam(defaultValue = "20") int activitySize
  ) {
    long userId = CurrentUser.requireUserId();
    Pageable comments = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(
        commentsPage,
        commentsSize
    );
    Pageable activity = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(
        activityPage,
        activitySize
    );
    return issueDetailService.getIssueDetail(userId, issueId, comments, activity);
  }

  @PatchMapping("/issues/{issueId}")
  public IssueDto updateIssue(
      @PathVariable long issueId,
      @Valid @RequestBody PatchIssueRequest request
  ) {
    long userId = CurrentUser.requireUserId();
    return issueService.updateIssue(userId, issueId, request);
  }
}

