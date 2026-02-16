/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, signal, ChangeDetectionStrategy, OnInit, OnDestroy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown'
import { IssueRowComponent } from '../../shared/components/issue-row/issue-row'
import { SearchInputComponent } from '../../shared/components/search-input/search-input'
import { CreateIssueModal } from '../create-issue-modal/create-issue-modal'
import { NoIssuesYetComponent } from '../no-issues-yet/no-issues-yet.component'
import { ProjectViewSubtabsComponent, ViewType } from '../project-view-subtabs/project-view-subtabs.component'
import { KanbanBoardComponent } from '../kanban-board/kanban-board.component'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { WebSocketService } from '../../core/realtime/websocket.service'
import { LocalCacheService } from '../../core/state/local-cache.service'
import { IssueDto, MembershipDto, PageResponse, ProjectDto } from '../../models/api.models'

/**
 * Projects - Project Issue List Component
 * Main dashboard displaying project workspace with issue tracking capabilities
 * Includes sidebar navigation, issue list with filtering, pagination, and project details
 */
@Component({
  selector: 'app-projects-project-issue-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SidebarComponent,
    IssueRowComponent,
    SearchInputComponent,
    CreateIssueModal,
    NoIssuesYetComponent,
    DropdownComponent,
    ProjectViewSubtabsComponent,
    KanbanBoardComponent
  ],
  templateUrl: './projects-project-issue-list.html',
  styleUrls: ['./projects-project-issue-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsProjectIssueList implements OnInit, OnDestroy {
  project = signal<ProjectDto | null>(null)
  issuesPage = signal<PageResponse<IssueDto> | null>(null)
  isLoading = signal(false)
  errorMessage = signal('')
  projectId = signal<number | null>(null)
  searchQuery = ''
  tagQuery = ''
  statusFilter = ''
  priorityFilter = ''
  assigneeFilter = ''
  sortFilter = ''
  readonly pageSize = 10
  activeView = signal<ViewType>('table')
  isCreateIssueOpen = signal(false)
  assigneeOptions = signal<AssigneeOption[]>([])
  showNotifications = signal(false)
  notifications = [
    { id: 'notif-1', message: 'New issue assigned to you', time: 'Just now' },
    { id: 'notif-2', message: 'Project updated by owner', time: '10m ago' },
  ]

  private readonly realtimeSubscriptions = new Subscription()

  statusDropdownOptions: DropdownOption[] = [
    { value: '', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'CLOSED', label: 'Closed' },
  ]
  priorityDropdownOptions: DropdownOption[] = [
    { value: '', label: 'All Priority' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ]
  sortDropdownOptions: DropdownOption[] = [
    { value: '', label: 'Sort: Updated' },
    { value: 'updatedAt,desc', label: 'updatedAt,desc' },
    { value: 'updatedAt,asc', label: 'updatedAt,asc' },
    { value: 'priority,desc', label: 'priority,desc' },
    { value: 'priority,asc', label: 'priority,asc' },
  ]

  paginationLabel = computed(() => {
    const page = this.issuesPage()
    if (!page) {
      return 'Showing 0 issues'
    }
    const start = page.totalElements === 0 ? 0 : page.page * page.size + 1
    const end = Math.min(page.totalElements, (page.page + 1) * page.size)
    return `Showing ${start} to ${end} of ${page.totalElements} issues`
  })

  totalPages = computed(() => this.issuesPage()?.totalPages ?? 0)
  currentPage = computed(() => (this.issuesPage()?.page ?? 0) + 1)
  totalIssues = computed(() => this.issuesPage()?.totalElements ?? 0)

  constructor(
    private readonly route: ActivatedRoute,
    private readonly issuesApi: IssuesApi,
    private readonly projectsApi: ProjectsApi,
    private readonly router: Router,
    private readonly websocketService: WebSocketService,
    private readonly localCache: LocalCacheService
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId.set(projectId)
      this.restoreViewPreference(projectId)
      this.loadProject(projectId)
      this.loadAssignees(projectId)
      this.loadIssuesPage(0)
      this.listenForRealtimeUpdates(projectId)
    }
  }

  ngOnDestroy(): void {
    this.realtimeSubscriptions.unsubscribe()
  }

  issueRows = computed(() => this.issuesPage()?.items ?? [])

  get hasPrevPage(): boolean {
    return (this.issuesPage()?.page ?? 0) > 0
  }

  get hasNextPage(): boolean {
    const page = this.issuesPage()
    if (!page) {
      return false
    }
    return page.page + 1 < page.totalPages
  }

  onSearchChange(): void {
    this.loadIssuesPage(0)
  }

  onFiltersChange(): void {
    this.loadIssuesPage(0)
  }

  onPrevPage(): void {
    if (this.hasPrevPage) {
      this.loadIssuesPage((this.issuesPage()?.page ?? 0) - 1)
    }
  }

  onNextPage(): void {
    if (this.hasNextPage) {
      this.loadIssuesPage((this.issuesPage()?.page ?? 0) + 1)
    }
  }

  onIssueSelected(issueId: number): void {
    const projectId = this.projectId()
    if (projectId === null) {
      return
    }
    this.router.navigate(['/app/projects', projectId, 'issues', issueId])
  }

  statusBadgeBgColor(status: string): string {
    const normalized = this.normalizeLabel(status)
    if (normalized === 'open') {
      return '#DBEAFE'
    }
    if (normalized === 'in progress') {
      return '#FEF3C7'
    }
    if (normalized === 'closed') {
      return '#F3F4F6'
    }
    return '#F3F4F6'
  }

  statusBadgeTextColor(status: string): string {
    const normalized = this.normalizeLabel(status)
    if (normalized === 'open') {
      return '#1E40AF'
    }
    if (normalized === 'in progress') {
      return '#92400E'
    }
    if (normalized === 'closed') {
      return '#475569'
    }
    return '#475569'
  }

  priorityBadgeBgColor(priority: string): string {
    const normalized = this.normalizeLabel(priority)
    if (normalized === 'high' || normalized === 'critical') {
      return '#FEE2E2'
    }
    if (normalized === 'medium') {
      return '#FEF3C7'
    }
    return '#F3F4F6'
  }

  priorityBadgeTextColor(priority: string): string {
    const normalized = this.normalizeLabel(priority)
    if (normalized === 'high' || normalized === 'critical') {
      return '#991B1B'
    }
    if (normalized === 'medium') {
      return '#92400E'
    }
    return '#6B7280'
  }

  toggleNotifications(): void {
     this.showNotifications.update((value) => !value)
   }

   onGoBack(): void {
     this.router.navigate(['/app/projects'])
   }

   onOpenCreateIssue(): void {
    this.isCreateIssueOpen.set(true)
  }

  onCloseCreateIssue(): void {
    this.isCreateIssueOpen.set(false)
  }

  onIssueCreated(issue: IssueDto): void {
    this.isCreateIssueOpen.set(false)
    this.loadIssuesPage(0)
    this.onIssueSelected(issue.id)
  }

  onViewChange(view: ViewType): void {
    this.activeView.set(view)
    this.persistViewPreference(view)
    if (view === 'kanban' && this.statusFilter) {
      this.statusFilter = ''
      this.loadIssuesPage(0)
    }
  }

  onKanbanIssueUpdated(issue: IssueDto): void {
    this.mergeIssueUpdate(issue)
  }

  toAssigneeLabel(assigneeUserId: number | null): string {
    return assigneeUserId ? `User ${assigneeUserId}` : 'Unassigned'
  }

  private loadProject(projectId: number) {
    this.projectsApi.getProject(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: () => this.errorMessage.set('Unable to load project.')
    })
  }

  private loadAssignees(projectId: number): void {
    this.projectsApi.listMembers(projectId, 0, 50).subscribe({
      next: (page) => {
        const options = page.items
          .filter(member => member.status === 'ACTIVE')
          .filter(member => member.userId !== null)
          .map(member => ({
            value: String(member.userId),
            label: this.mapMemberLabel(member)
          }))
        this.assigneeOptions.set([{ value: '', label: 'All Assignees' }, ...options])
      },
      error: () => {
        this.assigneeOptions.set([{ value: '', label: 'All Assignees' }])
      }
    })
  }

  private mapMemberLabel(member: MembershipDto): string {
    return member.userId ? `User ${member.userId}` : member.invitedEmail || 'Member'
  }

  private loadIssuesPage(pageIndex: number) {
    const projectId = this.projectId()
    if (projectId === null) {
      return
    }
    this.isLoading.set(true)
    this.errorMessage.set('')
    const assigneeId = this.assigneeFilter ? Number(this.assigneeFilter) : null
    this.issuesApi.listIssues(projectId, {
      page: pageIndex,
      size: this.pageSize,
      status: this.statusFilter || null,
      priority: this.priorityFilter || null,
      assigneeUserId: Number.isNaN(assigneeId) ? null : assigneeId,
      tag: this.tagQuery || null,
      q: this.searchQuery || null,
      sort: this.sortFilter || null
    }).subscribe({
      next: (page) => {
        this.issuesPage.set(page)
        this.isLoading.set(false)
      },
      error: () => {
        this.errorMessage.set('Unable to load issues.')
        this.isLoading.set(false)
      }
    })
  }

  private listenForRealtimeUpdates(projectId: number): void {
    this.realtimeSubscriptions.add(
      this.websocketService
        .subscribeJson<unknown>(`/topic/projects.${projectId}`)
        .subscribe({
          next: (payload) => {
            if (this.isIssuePayload(payload)) {
              this.mergeIssueUpdate(payload)
            }
          },
          error: () => this.errorMessage.set('Realtime updates unavailable.')
        })
    )
  }

  private restoreViewPreference(projectId: number): void {
    const cached = this.localCache.get<ViewType>(this.viewPreferenceKey(projectId))
    if (cached === 'kanban' || cached === 'table') {
      this.activeView.set(cached)
    }
  }

  private persistViewPreference(view: ViewType): void {
    const projectId = this.projectId()
    if (projectId === null) {
      return
    }
    this.localCache.set(this.viewPreferenceKey(projectId), view)
  }

  private viewPreferenceKey(projectId: number): string {
    return this.localCache.key('projects', projectId, 'issues', 'view')
  }

  private mergeIssueUpdate(issue: IssueDto): void {
    const current = this.issuesPage()
    if (!current) {
      return
    }
    const items = [...current.items]
    const index = items.findIndex((item) => item.id === issue.id)
    if (index >= 0) {
      items[index] = issue
    } else {
      items.unshift(issue)
    }
    this.issuesPage.set({ ...current, items })
  }

  private isIssuePayload(payload: unknown): payload is IssueDto {
    return this.isObject(payload) && typeof payload['id'] === 'number' && typeof payload['title'] === 'string'
  }

  private isObject(payload: unknown): payload is Record<string, unknown> {
    return typeof payload === 'object' && payload !== null
  }

  formatLabel(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }

  private normalizeLabel(value: string): string {
    return (value || '')
      .trim()
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
  }
}

interface AssigneeOption {
  value: string
  label: string
}
