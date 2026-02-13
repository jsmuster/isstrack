package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "status")
public class StatusEntity {
  @Id
  @Column(name = "status_id")
  private Short statusId;

  @Column(nullable = false, unique = true)
  private String name;

  public Short getStatusId() {
    return statusId;
  }

  public void setStatusId(Short statusId) {
    this.statusId = statusId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
