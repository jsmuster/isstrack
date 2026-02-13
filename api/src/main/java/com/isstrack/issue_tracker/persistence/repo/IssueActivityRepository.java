package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.IssueActivityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueActivityRepository extends JpaRepository<IssueActivityEntity, Long> {
  Page<IssueActivityEntity> findByIssueIdOrderByCreatedAtDesc(Long issueId, Pageable pageable);
}
