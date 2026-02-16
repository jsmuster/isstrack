/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.error.ForbiddenException;
import com.isstrack.issue_tracker.domain.model.MembershipStatus;
import com.isstrack.issue_tracker.domain.model.ProjectRole;
import com.isstrack.issue_tracker.persistence.repo.ProjectMembershipRepository;
import org.springframework.stereotype.Service;

@Service
public class ProjectAccessService {
  private final ProjectMembershipRepository membershipRepository;

  public ProjectAccessService(ProjectMembershipRepository membershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  public void requireActiveMember(long userId, long projectId) {
    var exists = membershipRepository.existsByProjectIdAndUserIdAndStatus(
        projectId,
        userId,
        MembershipStatus.ACTIVE.name()
    );
    if (!exists) {
      throw new ForbiddenException("Not a project member");
    }
  }

  public void requireOwner(long userId, long projectId) {
    var membership = membershipRepository.findByProjectIdAndUserIdAndStatus(
        projectId,
        userId,
        MembershipStatus.ACTIVE.name()
    ).orElseThrow(() -> new ForbiddenException("Not a project member"));
    if (!ProjectRole.OWNER.name().equals(membership.getRole())) {
      throw new ForbiddenException("Owner role required");
    }
  }
}

