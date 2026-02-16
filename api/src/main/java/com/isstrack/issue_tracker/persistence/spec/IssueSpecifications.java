/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.spec;

import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import org.springframework.data.jpa.domain.Specification;

public final class IssueSpecifications {
  private IssueSpecifications() {
  }

  public static Specification<IssueEntity> byProjectId(Long projectId) {
    return (root, query, builder) -> builder.equal(root.get("project").get("id"), projectId);
  }

  public static Specification<IssueEntity> byStatusName(String statusName) {
    return (root, query, builder) -> builder.equal(
        builder.lower(root.get("status").get("name")),
        statusName.toLowerCase()
    );
  }

  public static Specification<IssueEntity> byPriorityName(String priorityName) {
    return (root, query, builder) -> builder.equal(
        builder.lower(root.get("priority").get("name")),
        priorityName.toLowerCase()
    );
  }

  public static Specification<IssueEntity> byAssigneeId(Long assigneeId) {
    return (root, query, builder) -> builder.equal(root.get("assignee").get("id"), assigneeId);
  }

  public static Specification<IssueEntity> byTagName(String tagName) {
    return (root, query, builder) -> {
      query.distinct(true);
      var issueTagJoin = root.join("issueTags");
      var tagJoin = issueTagJoin.join("tag");
      return builder.equal(builder.lower(tagJoin.get("name")), tagName.toLowerCase());
    };
  }

  public static Specification<IssueEntity> byTitleQuery(String queryText) {
    return (root, query, builder) -> builder.like(
        builder.lower(root.get("title")),
        "%" + queryText.toLowerCase() + "%"
    );
  }
}

