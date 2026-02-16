/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.mapper;

import com.isstrack.issue_tracker.api.dto.ActivityDto;
import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.MembershipDto;
import com.isstrack.issue_tracker.api.dto.ProjectDto;
import com.isstrack.issue_tracker.api.dto.UserDto;
import com.isstrack.issue_tracker.persistence.entity.IssueActivityEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueCommentEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.entity.ProjectEntity;
import com.isstrack.issue_tracker.persistence.entity.ProjectMembershipEntity;
import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import java.util.List;

public final class EntityMapper {
  private EntityMapper() {
  }

  public static UserDto toUserDto(UserEntity entity) {
    return new UserDto(
        entity.getId(),
        entity.getEmail(),
        entity.getUsername(),
        entity.getFirstName(),
        entity.getLastName(),
        entity.getRole().getName()
    );
  }

  public static ProjectDto toProjectDto(ProjectEntity entity) {
    return new ProjectDto(
        entity.getId(),
        entity.getName(),
        entity.getPrefix(),
        entity.getOwner().getId(),
        entity.getOwner().getEmail(),
        entity.getCreatedAt(),
        entity.getUpdatedAt()
    );
  }

  public static MembershipDto toMembershipDto(ProjectMembershipEntity entity) {
    return new MembershipDto(
        entity.getId(),
        entity.getProject().getId(),
        entity.getUser() == null ? null : entity.getUser().getId(),
        entity.getInvitedEmail(),
        entity.getRole(),
        entity.getStatus(),
        entity.getCreatedAt()
    );
  }

  public static IssueDto toIssueDto(IssueEntity entity, List<String> tags) {
    String issueKey = null;
    if (entity.getIssueNumber() != null && entity.getProject().getPrefix() != null) {
        issueKey = entity.getProject().getPrefix() + "-" + String.format("%03d", entity.getIssueNumber());
    }
    return new IssueDto(
        entity.getId(),
        entity.getProject().getId(),
        entity.getIssueNumber(),
        issueKey,
        entity.getTitle(),
        entity.getStatus().getName(),
        entity.getPriority().getName(),
        entity.getOwner().getId(),
        entity.getAssignee() == null ? null : entity.getAssignee().getId(),
        tags,
        entity.getUpdatedAt()
    );
  }

  public static CommentDto toCommentDto(IssueCommentEntity entity) {
    return new CommentDto(
        entity.getId(),
        entity.getIssue().getId(),
        entity.getAuthor().getId(),
        entity.getBody(),
        entity.getCreatedAt()
    );
  }

  public static ActivityDto toActivityDto(IssueActivityEntity entity) {
    return new ActivityDto(
        entity.getId(),
        entity.getIssue().getId(),
        entity.getActor().getId(),
        entity.getMessage(),
        entity.getCreatedAt()
    );
  }
}

