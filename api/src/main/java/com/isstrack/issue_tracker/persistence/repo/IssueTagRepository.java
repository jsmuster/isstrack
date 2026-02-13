package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.IssueTagEntity;
import com.isstrack.issue_tracker.persistence.entity.IssueTagEntity.IssueTagId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IssueTagRepository extends JpaRepository<IssueTagEntity, IssueTagId> {
  @Query("""
      select it.issue.id, it.tag.name
      from IssueTagEntity it
      where it.issue.id in :issueIds
      """)
  List<Object[]> findIssueTagsByIssueIds(@Param("issueIds") List<Long> issueIds);

  void deleteByIssue_Id(Long issueId);
}
