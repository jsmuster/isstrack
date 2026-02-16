/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.domain.security.CurrentUser;
import com.isstrack.issue_tracker.domain.service.ActivityQueryService;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/issues/{issueId}/activity")
public class ActivityController {
  private final ActivityQueryService activityQueryService;

  public ActivityController(ActivityQueryService activityQueryService) {
    this.activityQueryService = activityQueryService;
  }

  @GetMapping
  public PageResponse<ActivityDto> listActivity(
      @PathVariable long issueId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    long userId = CurrentUser.requireUserId();
    Pageable pageable = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(page, size);
    return activityQueryService.listActivity(userId, issueId, pageable);
  }
}

