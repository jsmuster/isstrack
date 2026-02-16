/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.IssueCommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueCommentRepository extends JpaRepository<IssueCommentEntity, Long> {
  Page<IssueCommentEntity> findByIssueIdOrderByCreatedAtDesc(Long issueId, Pageable pageable);
}

