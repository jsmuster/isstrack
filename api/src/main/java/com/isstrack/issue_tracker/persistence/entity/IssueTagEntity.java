package com.isstrack.issue_tracker.persistence.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "issue_tags")
public class IssueTagEntity {
  @EmbeddedId
  private IssueTagId id = new IssueTagId();

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("issueId")
  @JoinColumn(name = "issue_id")
  private IssueEntity issue;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("tagId")
  @JoinColumn(name = "tag_id")
  private TagEntity tag;

  public IssueTagId getId() {
    return id;
  }

  public void setId(IssueTagId id) {
    this.id = id;
  }

  public IssueEntity getIssue() {
    return issue;
  }

  public void setIssue(IssueEntity issue) {
    this.issue = issue;
  }

  public TagEntity getTag() {
    return tag;
  }

  public void setTag(TagEntity tag) {
    this.tag = tag;
  }

  @Embeddable
  public static class IssueTagId implements Serializable {
    @jakarta.persistence.Column(name = "issue_id")
    private Long issueId;
    @jakarta.persistence.Column(name = "tag_id")
    private Long tagId;

    public IssueTagId() {
    }

    public IssueTagId(Long issueId, Long tagId) {
      this.issueId = issueId;
      this.tagId = tagId;
    }

    public Long getIssueId() {
      return issueId;
    }

    public void setIssueId(Long issueId) {
      this.issueId = issueId;
    }

    public Long getTagId() {
      return tagId;
    }

    public void setTagId(Long tagId) {
      this.tagId = tagId;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (!(o instanceof IssueTagId that)) {
        return false;
      }
      return Objects.equals(issueId, that.issueId) && Objects.equals(tagId, that.tagId);
    }

    @Override
    public int hashCode() {
      return Objects.hash(issueId, tagId);
    }
  }
}
