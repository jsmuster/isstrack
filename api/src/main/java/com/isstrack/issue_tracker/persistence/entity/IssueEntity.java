/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "issues")
public class IssueEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id", nullable = false)
  private ProjectEntity project;

  @Column(name = "issue_number")
  private Integer issueNumber;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "text")
  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "status_id", nullable = false)
  private StatusEntity status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "priority_id", nullable = false)
  private PriorityEntity priority;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_user_id", nullable = false)
  private UserEntity owner;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assignee_user_id")
  private UserEntity assignee;

  @OneToMany(mappedBy = "issue", fetch = FetchType.LAZY, orphanRemoval = true)
  private Set<IssueTagEntity> issueTags = new HashSet<>();

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @Column(name = "closed_at")
  private Instant closedAt;

  @Version
  @Column(nullable = false)
  private int version;

  @PrePersist
  void onCreate() {
    var now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ProjectEntity getProject() {
    return project;
  }

  public void setProject(ProjectEntity project) {
    this.project = project;
  }

  public Integer getIssueNumber() { return issueNumber; }
  public void setIssueNumber(Integer issueNumber) { this.issueNumber = issueNumber; }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public StatusEntity getStatus() {
    return status;
  }

  public void setStatus(StatusEntity status) {
    this.status = status;
  }

  public PriorityEntity getPriority() {
    return priority;
  }

  public void setPriority(PriorityEntity priority) {
    this.priority = priority;
  }

  public UserEntity getOwner() {
    return owner;
  }

  public void setOwner(UserEntity owner) {
    this.owner = owner;
  }

  public UserEntity getAssignee() {
    return assignee;
  }

  public void setAssignee(UserEntity assignee) {
    this.assignee = assignee;
  }

  public Set<IssueTagEntity> getIssueTags() {
    return issueTags;
  }

  public void setIssueTags(Set<IssueTagEntity> issueTags) {
    this.issueTags = issueTags;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }

  public Instant getClosedAt() {
    return closedAt;
  }

  public void setClosedAt(Instant closedAt) {
    this.closedAt = closedAt;
  }

  public int getVersion() {
    return version;
  }

  public void setVersion(int version) {
    this.version = version;
  }
}

