CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_projects_owner_user_id ON projects(owner_user_id);
CREATE INDEX idx_project_memberships_project_user_status ON project_memberships(project_id, user_id, status);
CREATE INDEX idx_issues_project_updated_at ON issues(project_id, updated_at DESC);
CREATE INDEX idx_issues_project_status_updated_at ON issues(project_id, status_id, updated_at DESC);
CREATE INDEX idx_issues_project_priority_updated_at ON issues(project_id, priority_id, updated_at DESC);
CREATE INDEX idx_issues_project_assignee_updated_at ON issues(project_id, assignee_user_id, updated_at DESC);
CREATE INDEX idx_issue_tags_tag_issue ON issue_tags(tag_id, issue_id);
CREATE INDEX idx_issue_comments_issue_created_at ON issue_comments(issue_id, created_at DESC);
CREATE INDEX idx_issue_activity_issue_created_at ON issue_activity(issue_id, created_at DESC);
CREATE INDEX idx_issues_title_trgm ON issues USING gin (title gin_trgm_ops);
CREATE INDEX idx_issues_project_title ON issues(project_id, title);
