# Backend Implementation Checklist

## Endpoints
- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [x] GET /api/auth/me
- [x] POST /api/projects
- [x] GET /api/projects
- [x] GET /api/projects/{projectId}
- [x] POST /api/projects/{projectId}/invites
- [x] GET /api/projects/{projectId}/members
- [x] POST /api/projects/invites/accept
- [x] POST /api/projects/{projectId}/issues
- [x] GET /api/projects/{projectId}/issues
- [x] GET /api/issues/{issueId}
- [x] PATCH /api/issues/{issueId}
- [x] POST /api/issues/{issueId}/comments
- [x] GET /api/issues/{issueId}/comments
- [x] GET /api/issues/{issueId}/activity

## Tables
- [x] roles
- [x] users
- [x] projects
- [x] project_memberships
- [x] status
- [x] priority
- [x] issues
- [x] tags
- [x] issue_tags
- [x] issue_comments
- [x] issue_activity

## Topics
- [x] /topic/projects.{projectId}
- [x] /topic/issues.{issueId}
- [x] /user/queue/notifications

## Events
- [x] IssueCreatedEvent
- [x] IssueUpdatedEvent
- [x] CommentAddedEvent
- [x] ActivityLoggedEvent
- [x] MemberAddedEvent
- [x] IssueAssignedEvent

## Tests
- [x] WebSocketBroadcaster routing unit test
- [x] IssueService activity logging unit test
- [x] IssueService assignee validation unit test
- [x] Integration test with Testcontainers
