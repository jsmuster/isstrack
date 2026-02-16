/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "priority")
public class PriorityEntity {
  @Id
  @Column(name = "priority_id")
  private Short priorityId;

  @Column(nullable = false, unique = true)
  private String name;

  public Short getPriorityId() {
    return priorityId;
  }

  public void setPriorityId(Short priorityId) {
    this.priorityId = priorityId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}

