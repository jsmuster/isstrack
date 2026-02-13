package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class RoleEntity {
  @Id
  @Column(name = "role_id")
  private Short roleId;

  @Column(nullable = false, unique = true)
  private String name;

  public Short getRoleId() {
    return roleId;
  }

  public void setRoleId(Short roleId) {
    this.roleId = roleId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
