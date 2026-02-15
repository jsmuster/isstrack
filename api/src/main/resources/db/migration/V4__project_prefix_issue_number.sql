ALTER TABLE projects ADD COLUMN prefix VARCHAR(10);

ALTER TABLE issues ADD COLUMN issue_number INT;

CREATE UNIQUE INDEX uq_project_prefix ON projects(prefix) WHERE prefix IS NOT NULL;
CREATE UNIQUE INDEX uq_issue_project_number ON issues(project_id, issue_number) WHERE issue_number IS NOT NULL;
