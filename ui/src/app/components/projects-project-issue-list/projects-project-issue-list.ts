import { Component, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { IssueRowComponent } from '../../shared/components/issue-row/issue-row'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { IssueDto, PageResponse, ProjectDto } from '../../models/api.models'

/**
 * Projects - Project Issue List Component
 * Main dashboard displaying project workspace with issue tracking capabilities
 * Includes sidebar navigation, issue list with filtering, pagination, and project details
 */
@Component({
  selector: 'app-projects-project-issue-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, IssueRowComponent],
  templateUrl: './projects-project-issue-list.html',
  styleUrls: ['./projects-project-issue-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsProjectIssueList implements OnInit {
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

  statusOptions = ['Open', 'In Progress', 'Closed']
  priorityOptions = ['Low', 'Medium', 'High']
  sortOptions = ['updatedAt,desc', 'updatedAt,asc', 'priority,desc', 'priority,asc']

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly issuesApi: IssuesApi,
    private readonly projectsApi: ProjectsApi,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId.set(projectId)
      this.loadProject(projectId)
      this.loadIssuesPage(0)
    }
  }

  get issueRows(): IssueDto[] {
    return this.issuesPage()?.items ?? []
  }

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

  toAssigneeLabel(assigneeUserId: number | null): string {
    return assigneeUserId ? `User ${assigneeUserId}` : 'Unassigned'
  }

  private loadProject(projectId: number) {
    this.projectsApi.getProject(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: () => this.errorMessage.set('Unable to load project.')
    })
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
}
