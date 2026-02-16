/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, signal, ChangeDetectionStrategy, OnInit, OnDestroy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { QuillModule } from 'ngx-quill'
import { ActivityItem } from './activity-item/activity-item'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { CommentsApi } from '../../features/comments/data/comments.api'
import { ActivityApi } from '../../features/activity/data/activity.api'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { WebSocketService } from '../../core/realtime/websocket.service'
import { ActivityDto, CommentDto, IssueDto, MembershipDto } from '../../models/api.models'
import { AuthStore } from '../../core/state/auth.store'

/**
 * Issue Details Component
 * Displays detailed information about a project issue including:
 * - Issue title, status, priority, assignee
 * - Tags and description
 * - Comments section
 * - Activity timeline
 */
interface IssueViewModel {
  id: number | null
  issueKey: string | null
  title: string
  status: string
  priority: string
  assigneeLabel: string
  tags: string[]
  description: string
  stepsToReproduce: string[]
  expectedBehavior: string
  createdDate: string
  updatedDate: string
}

interface AssigneeOption {
  value: string
  label: string
}

interface CommentEditState {
  id: number
  body: string
  isSaving: boolean
}

@Component({
  selector: 'issue-details',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ActivityItem, SidebarComponent, DropdownComponent],
  templateUrl: './issue-details.html',
  styleUrls: ['./issue-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetails implements OnInit, OnDestroy {
  issue = signal<IssueDto | null>(null)
  description = signal('')
  comments = signal<CommentDto[]>([])
  activityItems = signal<ActivityDto[]>([])
  assignees = signal<AssigneeOption[]>([])
  editingComment = signal<CommentEditState | null>(null)
  errorMessage = signal('')
  isLoading = signal(false)
  isSubmitting = signal(false)
  showNotifications = signal(false)
  notifications = [
    { id: 'notif-1', message: 'New comment added', time: 'Just now' },
    { id: 'notif-2', message: 'Issue status updated', time: '20m ago' },
  ]

  isEditingDescription = signal(false)
  isSavingDescription = signal(false)
  descriptionDraft = signal('')
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'code-block', 'clean']
    ]
  }

  statusOptions: DropdownOption[] = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'CLOSED', label: 'Closed' },
  ]

  priorityOptions: DropdownOption[] = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ]

  private readonly realtimeSubscriptions = new Subscription()

  totalComments = signal(0)
  totalActivityItems = signal(0)
  commentsPageIndex = signal(0)
  activityPageIndex = signal(0)
  readonly pageSize = 5

  projectId: number | null = null
  issueId: number | null = null

  newComment = ''

  issueData = computed<IssueViewModel>(() => {
    const issue = this.issue()
    const description = this.description()
    return {
      id: issue?.id ?? null,
      issueKey: issue?.issueKey ?? null,
      title: issue?.title ?? 'Issue details',
      status: issue?.status ?? 'OPEN',
      priority: issue?.priority ?? 'MEDIUM',
      assigneeLabel: this.toAssigneeLabel(issue?.assigneeUserId ?? null),
      tags: issue?.tags ?? [],
      description: description || 'No description available.',
      stepsToReproduce: [],
      expectedBehavior: '',
      createdDate: issue?.updatedAt ?? '',
      updatedDate: issue?.updatedAt ?? ''
    }
  })

  canLoadMoreComments = computed(() => this.comments().length < this.totalComments())
  commentsSummaryLabel = computed(() => {
    const visible = this.comments().length
    const total = this.totalComments()
    if (total > this.pageSize) {
      return `Comments (${visible} out of ${total})`
    }
    if (total === 0) {
      return 'Comments'
    }
    return `Comments (${total})`
  })

  constructor(
     private readonly route: ActivatedRoute,
     private readonly router: Router,
     private readonly issuesApi: IssuesApi,
     private readonly commentsApi: CommentsApi,
     private readonly activityApi: ActivityApi,
     private readonly projectsApi: ProjectsApi,
     private readonly websocketService: WebSocketService,
     private readonly authStore: AuthStore
   ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    const issueId = Number(this.route.snapshot.paramMap.get('issueId'))
    if (!Number.isNaN(projectId)) {
      this.projectId = projectId
      this.loadAssignees(projectId)
    }
    if (!Number.isNaN(issueId)) {
      this.issueId = issueId
      this.loadIssue(issueId)
      this.listenForRealtimeUpdates(issueId, this.projectId)
    }
  }

  ngOnDestroy(): void {
    this.realtimeSubscriptions.unsubscribe()
  }

  /**
   * Updates the issue status
   */
  onStatusChange(newStatus: string): void {
    if (!this.issueId) {
      return
    }
    this.issuesApi.patchIssue(this.issueId, { status: newStatus }).subscribe({
      next: (issue) => this.issue.set(issue),
      error: () => this.errorMessage.set('Unable to update status.')
    })
  }

  /**
   * Updates the issue priority
   */
  onPriorityChange(newPriority: string): void {
    if (!this.issueId) {
      return
    }
    this.issuesApi.patchIssue(this.issueId, { priority: newPriority }).subscribe({
      next: (issue) => this.issue.set(issue),
      error: () => this.errorMessage.set('Unable to update priority.')
    })
  }

  /**
   * Updates the issue assignee
   */
  onAssigneeChange(newAssignee: string): void {
    if (!this.issueId) {
      return
    }
    const assigneeId = Number(newAssignee)
    const payload = newAssignee
      ? { assigneeUserId: assigneeId }
      : { clearAssignee: true }
    this.issuesApi.patchIssue(this.issueId, payload).subscribe({
      next: (issue) => this.issue.set(issue),
      error: () => this.errorMessage.set('Unable to update assignee.')
    })
  }

  /**
   * Adds a new tag to the issue
   */
  onAddTag(newTag: string): void {
    if (!this.issueId) {
      return
    }
    const tag = newTag.trim()
    const current = this.issue()
    if (!tag || !current) {
      return
    }
    if (current.tags.includes(tag)) {
      return
    }
    const tags = [...current.tags, tag]
    this.issuesApi.patchIssue(this.issueId, { tags }).subscribe({
      next: (issue) => this.issue.set(issue),
      error: () => this.errorMessage.set('Unable to update tags.')
    })
  }

  /**
   * Removes a tag from the issue
   */
  onRemoveTag(tag: string): void {
    if (!this.issueId) {
      return
    }
    const current = this.issue()
    if (!current) {
      return
    }
    const tags = current.tags.filter(t => t !== tag)
    this.issuesApi.patchIssue(this.issueId, { tags }).subscribe({
      next: (issue) => this.issue.set(issue),
      error: () => this.errorMessage.set('Unable to update tags.')
    })
  }

  /**
   * Opens the inline editor for the description
   */
  onEditDescription(): void {
    if (!this.issueId) {
      return
    }
    this.descriptionDraft.set(this.description())
    this.isEditingDescription.set(true)
  }

  onCancelDescriptionEdit(): void {
    this.descriptionDraft.set(this.description())
    this.isEditingDescription.set(false)
  }

  onSaveDescription(): void {
    if (!this.issueId || this.isSavingDescription()) {
      return
    }
    const updated = this.descriptionDraft()
    this.isSavingDescription.set(true)
    this.issuesApi.patchIssue(this.issueId, { description: updated }).subscribe({
      next: () => {
        this.description.set(updated)
        this.isEditingDescription.set(false)
        this.isSavingDescription.set(false)
      },
      error: () => {
        this.errorMessage.set('Unable to update description.')
        this.isSavingDescription.set(false)
      }
    })
  }

  /**
   * Submits a new comment
   */
  onAddComment(): void {
    if (!this.issueId || this.isSubmitting()) {
      return
    }
    const content = this.newComment.trim()
    if (!content) {
      return
    }
    this.isSubmitting.set(true)
    this.commentsApi.addComment(this.issueId, { body: content }).subscribe({
      next: (comment) => {
        let didAdd = false
        this.comments.update((items) => {
          if (items.some((item) => item.id === comment.id)) {
            return items
          }
          didAdd = true
          return [comment, ...items]
        })
        if (didAdd) {
          this.totalComments.update((total) => total + 1)
        }
        this.newComment = ''
        this.resetCommentHeight()
        this.isSubmitting.set(false)
      },
      error: () => {
        this.errorMessage.set('Unable to add comment.')
        this.isSubmitting.set(false)
      }
    })
  }

  adjustCommentHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  private resetCommentHeight(): void {
    const textarea = document.querySelector<HTMLTextAreaElement>('.comment-textarea')
    if (!textarea) {
      return
    }
    textarea.style.height = ''
  }

  /**
   * Loads more comments
   */
  onLoadMoreComments(): void {
    if (!this.issueId) {
      return
    }
    if (this.comments().length >= this.totalComments()) {
      return
    }
    const total = this.totalComments()
    this.commentsApi.listComments(this.issueId, 0, total).subscribe({
      next: (page) => {
        this.comments.set(page.items)
        this.commentsPageIndex.set(page.page)
      },
      error: () => this.errorMessage.set('Unable to load more comments.')
    })
  }

  /**
   * Loads more activity items
   */
  onLoadMoreActivity(): void {
    if (!this.issueId) {
      return
    }
    if (this.activityItems().length >= this.totalActivityItems()) {
      return
    }
    const nextPage = this.activityPageIndex() + 1
    this.activityApi.listActivity(this.issueId, nextPage, this.pageSize).subscribe({
      next: (page) => {
        this.activityItems.update(items => [...items, ...page.items])
        this.activityPageIndex.set(page.page)
      },
      error: () => this.errorMessage.set('Unable to load more activity.')
    })
  }

  toggleNotifications(): void {
     this.showNotifications.update((value) => !value)
   }

   /**
    * Goes back to the issue list
    */
   onGoBack(): void {
     if (this.projectId === null) {
       this.router.navigate(['/app/projects'])
       return
     }
     this.router.navigate(['/app/projects', this.projectId, 'issues'])
   }

   /**
    * Deletes a comment
    */
  onDeleteComment(commentId: number): void {
    if (!this.issueId || !this.canManageComment(commentId)) {
      return
    }
    this.commentsApi.deleteComment(this.issueId, commentId).subscribe({
      next: () => {
        this.comments.update(comments => comments.filter(c => c.id !== commentId))
        this.totalComments.update(total => Math.max(total - 1, 0))
      },
      error: () => {
        this.errorMessage.set('Unable to delete comment.')
      }
    })
  }

  /**
   * Edits a comment
   */
  onEditComment(comment: CommentDto): void {
    if (!this.canManageComment(comment.id)) {
      return
    }
    this.editingComment.set({ id: comment.id, body: comment.body, isSaving: false })
    setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>('.comment-edit-textarea')
      if (textarea) {
        this.adjustCommentHeight(textarea)
        textarea.focus()
      }
    }, 0)
  }

  onCancelCommentEdit(): void {
    this.editingComment.set(null)
  }

  onSaveCommentEdit(): void {
    if (!this.issueId) {
      return
    }
    const editing = this.editingComment()
    if (!editing) {
      return
    }
    const body = editing.body.trim()
    if (!body) {
      return
    }
    this.editingComment.set({ ...editing, isSaving: true, body })
    this.commentsApi.updateComment(this.issueId, editing.id, { body }).subscribe({
      next: (updated) => {
        this.comments.update(items => items.map(item => item.id === updated.id ? updated : item))
        this.editingComment.set(null)
      },
      error: () => {
        this.errorMessage.set('Unable to update comment.')
        this.editingComment.set({ ...editing, isSaving: false, body })
      }
    })
  }

  updateEditingCommentBody(value: string): void {
    const editing = this.editingComment()
    if (!editing) {
      return
    }
    this.editingComment.set({ ...editing, body: value })
  }

  isEditingComment(commentId: number): boolean {
    return this.editingComment()?.id === commentId
  }

  canManageComment(commentId: number): boolean {
    const comment = this.comments().find(item => item.id === commentId)
    if (!comment) {
      return false
    }
    const currentUser = this.authStore.currentUser()
    if (!currentUser) {
      return false
    }
    if (comment.authorUserId === currentUser.id) {
      return true
    }
    return this.issue()?.ownerUserId === currentUser.id
  }

  isCommentAuthor(comment: CommentDto): boolean {
    const currentUser = this.authStore.currentUser()
    return Boolean(currentUser?.id && comment.authorUserId === currentUser.id)
  }

  canManageComments(): boolean {
    return this.authStore.currentUser() !== null
  }

  /**
   * Get tag color class
   */
  getTagColor(tag: string): string {
    const tagLower = tag.toLowerCase()
    if (tagLower === 'bug') return 'tag-bug'
    if (tagLower === 'feature' || tagLower === 'mobile') return 'tag-feature'
    if (tagLower === 'authentication') return 'tag-default'
    return 'tag-default'
  }

  getActivityType(message: string): string {
    if (!message) return 'comment'
    const msg = message.toLowerCase()
    if (msg.includes('comment')) return 'comment'
    if (msg.includes('priority')) return 'priority'
    if (msg.includes('assign')) return 'assignment'
    if (msg.includes('status')) return 'status'
    if (msg.includes('tag')) return 'tag'
    if (msg.includes('created') || msg.includes('opened')) return 'created'
    return 'comment'
  }

  onAddTagPrompt(): void {
    const tag = window.prompt('Tag name')
    if (tag) {
      this.onAddTag(tag)
    }
  }

  formatTimestamp(dateValue: string): string {
    if (!dateValue) {
      return ''
    }
    const date = new Date(dateValue)
    return Number.isNaN(date.getTime()) ? dateValue : date.toLocaleString()
  }

  private toAssigneeLabel(assigneeUserId: number | null): string {
    return assigneeUserId ? `User ${assigneeUserId}` : 'Unassigned'
  }

  private loadIssue(issueId: number): void {
    this.isLoading.set(true)
    this.errorMessage.set('')
    this.issuesApi.getIssueDetail(issueId, 0, this.pageSize, 0, this.pageSize).subscribe({
      next: (detail) => {
        this.issue.set(detail.issue)
        this.description.set(detail.description ?? '')
        this.activityItems.set(detail.activity.items)
        this.totalComments.set(detail.comments.totalElements)
        this.totalActivityItems.set(detail.activity.totalElements)
        this.activityPageIndex.set(detail.activity.page)
        this.isLoading.set(false)
        this.loadInitialComments(issueId)
      },
      error: () => {
        this.errorMessage.set('Unable to load issue details.')
        this.isLoading.set(false)
      }
    })
  }

  private loadInitialComments(issueId: number): void {
    this.commentsApi.listComments(issueId, 0, this.pageSize).subscribe({
      next: (page) => {
        this.comments.set(page.items)
        if (page.totalElements > this.totalComments()) {
          this.totalComments.set(page.totalElements)
        }
        this.commentsPageIndex.set(page.page)
      },
      error: () => {
        this.errorMessage.set('Unable to load comments.')
      }
    })
  }

  private loadAssignees(projectId: number): void {
    this.projectsApi.listMembers(projectId, 0, 50).subscribe({
      next: (page) => {
        const options = page.items
          .filter(member => member.status === 'ACTIVE')
          .filter(member => member.userId !== null)
          .map(member => ({ value: String(member.userId), label: this.mapMemberLabel(member) }))
        this.assignees.set([{ value: '', label: 'Unassigned' }, ...options])
      },
      error: () => {
        this.assignees.set([{ value: '', label: 'Unassigned' }])
      }
    })
  }

  private mapMemberLabel(member: MembershipDto): string {
    return member.userId ? `User ${member.userId}` : member.invitedEmail || 'Member'
  }

  private listenForRealtimeUpdates(issueId: number, projectId: number | null): void {
    this.realtimeSubscriptions.add(
      this.websocketService
        .subscribeJson<unknown>(`/topic/issues.${issueId}`)
        .subscribe({
          next: (payload) => this.handleIssueStreamPayload(payload),
          error: () => this.errorMessage.set('Realtime updates unavailable.')
        })
    )
    if (projectId === null) {
      return
    }
    this.realtimeSubscriptions.add(
      this.websocketService
        .subscribeJson<unknown>(`/topic/projects.${projectId}`)
        .subscribe({
          next: (payload) => this.handleProjectStreamPayload(payload),
          error: () => this.errorMessage.set('Realtime updates unavailable.')
        })
    )
  }

  private handleRealtimeComment(comment: CommentDto): void {
    if (!comment?.id || comment.issueId !== this.issueId) {
      return
    }
    let didAdd = false
    this.comments.update((items) => {
      if (items.some((item) => item.id === comment.id)) {
        return items
      }
      didAdd = true
      return [comment, ...items]
    })
    if (didAdd) {
      this.totalComments.update((total) => total + 1)
    }
  }

  private handleRealtimeActivity(activity: ActivityDto): void {
    if (!activity?.id || activity.issueId !== this.issueId) {
      return
    }
    this.activityItems.update((items) => {
      if (items.some((item) => item.id === activity.id)) {
        return items
      }
      return [activity, ...items]
    })
    this.totalActivityItems.update((total) => total + 1)
  }

  private handleIssueStreamPayload(payload: unknown): void {
    if (this.isCommentPayload(payload)) {
      this.handleRealtimeComment(payload)
      return
    }
    if (this.isActivityPayload(payload)) {
      this.handleRealtimeActivity(payload)
    }
  }

  private handleProjectStreamPayload(payload: unknown): void {
    if (!this.isIssuePayload(payload)) {
      return
    }
    if (this.issueId && payload.id === this.issueId) {
      this.issue.set(payload)
    }
  }

  private isCommentPayload(payload: unknown): payload is CommentDto {
    return this.isObject(payload) && typeof payload['id'] === 'number' && typeof payload['body'] === 'string'
  }

  private isActivityPayload(payload: unknown): payload is ActivityDto {
    return this.isObject(payload) && typeof payload['id'] === 'number' && typeof payload['message'] === 'string'
  }

  private isIssuePayload(payload: unknown): payload is IssueDto {
    return this.isObject(payload) && typeof payload['id'] === 'number' && typeof payload['title'] === 'string'
  }

  private isObject(payload: unknown): payload is Record<string, unknown> {
    return typeof payload === 'object' && payload !== null
  }
}
