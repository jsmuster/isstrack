package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "issue_comments")
public class IssueCommentEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "issue_id", nullable = false)
  private IssueEntity issue;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_user_id", nullable = false)
  private UserEntity author;

  @Column(nullable = false, columnDefinition = "text")
  private String body;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    createdAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public IssueEntity getIssue() {
    return issue;
  }

  public void setIssue(IssueEntity issue) {
    this.issue = issue;
  }

  public UserEntity getAuthor() {
    return author;
  }

  public void setAuthor(UserEntity author) {
    this.author = author;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
