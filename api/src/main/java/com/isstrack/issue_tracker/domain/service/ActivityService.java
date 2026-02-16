/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.domain.event.ActivityLoggedEvent;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.entity.IssueActivityEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueActivityRepository;
import java.time.Instant;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityService {
  private final IssueActivityRepository activityRepository;
  private final ApplicationEventPublisher eventPublisher;

  public ActivityService(IssueActivityRepository activityRepository, ApplicationEventPublisher eventPublisher) {
    this.activityRepository = activityRepository;
    this.eventPublisher = eventPublisher;
  }

  @Transactional
  public ActivityDto logActivity(IssueEntity issue, UserEntity actor, String message) {
    var activity = new IssueActivityEntity();
    activity.setIssue(issue);
    activity.setActor(actor);
    activity.setMessage(message);
    var saved = activityRepository.save(activity);
    var dto = EntityMapper.toActivityDto(saved);
    eventPublisher.publishEvent(new ActivityLoggedEvent(issue.getId(), dto, Instant.now()));
    return dto;
  }
}

