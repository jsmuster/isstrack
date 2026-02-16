/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.ProjectMembershipEntity;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMembershipRepository extends JpaRepository<ProjectMembershipEntity, Long> {
  Optional<ProjectMembershipEntity> findByProjectIdAndUserIdAndStatus(
      Long projectId,
      Long userId,
      String status
  );

  boolean existsByProjectIdAndUserIdAndStatus(Long projectId, Long userId, String status);

  Page<ProjectMembershipEntity> findByProjectIdAndStatus(Long projectId, String status, Pageable pageable);

  Page<ProjectMembershipEntity> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

  Optional<ProjectMembershipEntity> findByProjectIdAndInvitedEmailIgnoreCaseAndStatus(
      Long projectId,
      String email,
      String status
  );

  Optional<ProjectMembershipEntity> findByInviteToken(String token);
}

