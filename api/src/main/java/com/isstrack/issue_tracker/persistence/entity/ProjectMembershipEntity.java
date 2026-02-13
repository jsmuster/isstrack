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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;

@Entity
@Table(name = "project_memberships")
public class ProjectMembershipEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id", nullable = false)
  private ProjectEntity project;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private UserEntity user;

  @Column(nullable = false)
  private String role;

  @Column(nullable = false)
  private String status;

  @Column(name = "invited_email")
  private String invitedEmail;

  @Column(name = "invite_token", unique = true)
  private String inviteToken;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "invited_by_user_id", nullable = false)
  private UserEntity inviter;

  @Column(name = "invite_expires_at")
  private Instant inviteExpiresAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

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

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getInvitedEmail() {
    return invitedEmail;
  }

  public void setInvitedEmail(String invitedEmail) {
    this.invitedEmail = invitedEmail;
  }

  public String getInviteToken() {
    return inviteToken;
  }

  public void setInviteToken(String inviteToken) {
    this.inviteToken = inviteToken;
  }

  public UserEntity getInviter() {
    return inviter;
  }

  public void setInviter(UserEntity inviter) {
    this.inviter = inviter;
  }

  public Instant getInviteExpiresAt() {
    return inviteExpiresAt;
  }

  public void setInviteExpiresAt(Instant inviteExpiresAt) {
    this.inviteExpiresAt = inviteExpiresAt;
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

  public int getVersion() {
    return version;
  }

  public void setVersion(int version) {
    this.version = version;
  }
}
