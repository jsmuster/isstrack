export interface UserDto {
  id: number | null
  email: string | null
  username: string | null
  firstName: string | null
  lastName: string | null
  role: string | null
}

export interface AuthResponse {
  accessToken: string
  user: UserDto
}

export interface ProjectDto {
  id: number
  name: string
  prefix: string | null
  ownerUserId: number
  ownerEmail: string
  createdAt: string
  updatedAt: string
}

export interface MembershipDto {
  id: number
  projectId: number
  userId: number | null
  invitedEmail: string | null
  role: 'OWNER' | 'MEMBER' | string
  status: 'ACTIVE' | 'INVITED' | string
  createdAt: string
}

export interface IssueDto {
  id: number
  projectId: number
  issueNumber: number | null
  issueKey: string | null
  title: string
  status: string
  priority: string
  ownerUserId: number
  assigneeUserId: number | null
  tags: string[]
  updatedAt: string
}

export interface CommentDto {
  id: number
  issueId: number
  authorUserId: number
  body: string
  createdAt: string
}

export interface ActivityDto {
  id: number
  issueId: number
  actorUserId: number
  message: string
  createdAt: string
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface IssueDetailDto {
  issue: IssueDto
  description: string | null
  comments: PageResponse<CommentDto>
  activity: PageResponse<ActivityDto>
}

export interface NotificationDto {
  type: string
  message: string
  createdAt: string
  meta: Record<string, unknown>
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  firstName: string | null
  lastName: string | null
}

export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface CreateProjectRequest {
  name: string
  prefix: string
}

export interface InviteMemberRequest {
  email: string
}

export interface AcceptInviteRequest {
  token: string
}

export interface CreateIssueRequest {
  title: string
  description: string | null
  priority: string
  assigneeUserId: number | null
  tags: string[] | null
}

export interface PatchIssueRequest {
  title?: string | null
  description?: string | null
  status?: string | null
  priority?: string | null
  assigneeUserId?: number | null
  clearAssignee?: boolean | null
  tags?: string[] | null
}

export interface AddCommentRequest {
  body: string
}

export interface UpdateCommentRequest {
  body: string
}
