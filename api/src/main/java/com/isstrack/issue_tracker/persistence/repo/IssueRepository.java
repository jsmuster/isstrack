/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IssueRepository extends JpaRepository<IssueEntity, Long>, JpaSpecificationExecutor<IssueEntity> {
  @Query("""
      select issue
      from IssueEntity issue
      join fetch issue.project
      join fetch issue.status
      join fetch issue.priority
      join fetch issue.owner
      left join fetch issue.assignee
      where issue.id = :issueId
      """)
  Optional<IssueEntity> findIssueDetailById(@Param("issueId") Long issueId);

  int countByProjectId(long projectId);
}

