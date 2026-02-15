import { Component, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectCardComponent } from '../../shared/components/project-card/project-card'
import { CreateNewProjectModalComponent } from '../create-new-project-modal/create-new-project-modal.component'
import { DropdownComponent } from '../../shared/components/dropdown/dropdown'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { AuthStore } from '../../core/state/auth.store'
import { IssueDto, ProjectDto } from '../../models/api.models'
import { debounceTime, Subject } from 'rxjs'

@Component({
  selector: 'projects-page-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ProjectCardComponent, CreateNewProjectModalComponent, DropdownComponent],
  templateUrl: './projects-page-project-list.html',
  styleUrls: ['./projects-page-project-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageProjectList implements OnInit {
  searchIssuesQuery = ''
  issueResults = signal<IssueDto[]>([])
  showIssueResults = signal(false)
  role = 'OWNER'
  viewMode = signal<'grid' | 'table'>('grid')
  filterBy = signal<'all' | 'owned' | 'shared'>('all')
  sortBy = signal<'recently-updated' | 'oldest-first'>('recently-updated')
  searchQuery = signal('')
  allProjects = signal<ProjectDto[]>([])
  openIssueCounts = signal<Record<number, number>>({})
  isLoading = signal(false)
  errorMessage = signal('')
  showNotifications = signal(false)
  isCreateProjectOpen = signal(false)
  notifications = [
    { id: 'notif-1', message: 'New project created', time: 'Just now' },
    { id: 'notif-2', message: 'Issue updated in workspace', time: '15m ago' },
  ]

  filterOptions = [
    { value: 'all' as const, label: 'All Projects' },
    { value: 'owned' as const, label: 'Owned by Me' },
    { value: 'shared' as const, label: 'Shared with Me' },
  ]
  sortOptions = [
    { value: 'recently-updated' as const, label: 'Recently Updated' },
    { value: 'oldest-first' as const, label: 'Oldest First' },
  ]

  filteredProjects = computed(() => {
    let projects = this.allProjects()
    const currentUserId = this.authStore.currentUser()?.id

    const filter = this.filterBy()
    if (filter === 'owned' && currentUserId != null) {
      projects = projects.filter(p => p.ownerUserId === currentUserId)
    } else if (filter === 'shared' && currentUserId != null) {
      projects = projects.filter(p => p.ownerUserId !== currentUserId)
    }

    const query = this.searchQuery().toLowerCase()
    if (query) {
      projects = projects.filter(p => p.name.toLowerCase().includes(query))
    }

    const sort = this.sortBy()
    projects = [...projects].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return sort === 'recently-updated' ? dateB - dateA : dateA - dateB
    })

    return projects
  })

  get hasProjects(): boolean {
    return this.filteredProjects().length > 0
  }

  get projects(): ProjectDto[] {
    return this.filteredProjects()
  }

  private issueSearchSubject = new Subject<string>()

  constructor(
    private readonly projectsApi: ProjectsApi,
    private readonly issuesApi: IssuesApi,
    private readonly authStore: AuthStore,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.issueSearchSubject.pipe(debounceTime(300)).subscribe((query) => {
      if (!query.trim()) {
        this.issueResults.set([])
        this.showIssueResults.set(false)
        return
      }
      this.issuesApi.searchIssues(query.trim()).subscribe({
        next: (page) => {
          this.issueResults.set(page.items)
          this.showIssueResults.set(true)
        },
        error: () => {
          this.issueResults.set([])
          this.showIssueResults.set(false)
        }
      })
    })
    this.loadProjects()
  }

  onSearchIssues(query: string) {
    this.searchIssuesQuery = query
    this.issueSearchSubject.next(query)
  }

  onIssueResultClick(issue: IssueDto) {
    this.showIssueResults.set(false)
    this.searchIssuesQuery = ''
    this.router.navigate(['/app/projects', issue.projectId, 'issues', issue.id])
  }

  onSearchProjects(query: string) {
    this.searchQuery.set(query)
  }

  trackProject(index: number, project: ProjectDto): number {
    return project.id
  }

  toggleViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode)
  }

  onFilterChange(filter: 'all' | 'owned' | 'shared') {
    this.filterBy.set(filter)
  }

  onSortChange(sort: 'recently-updated' | 'oldest-first') {
    this.sortBy.set(sort)
  }

  onNewProject() {
    this.isCreateProjectOpen.set(true)
  }

  onNotificationClick() {
    this.showNotifications.update((value) => !value)
  }

  onSettingsClick() {
    console.log('Settings clicked')
  }

  onCreateProjectClosed(): void {
    this.isCreateProjectOpen.set(false)
  }

  onProjectCreated(project: ProjectDto): void {
    this.isCreateProjectOpen.set(false)
    this.router.navigate(['/app/projects', project.id, 'issues'])
  }

  getOpenIssueCount(projectId: number): number {
    return this.openIssueCounts()[projectId] ?? 0
  }

  getOpenIssuesLabel(projectId: number): string {
    const count = this.getOpenIssueCount(projectId)
    return count === 1 ? '1 Open Issue' : `${count} Open Issues`
  }

  getIssuesBgColor(projectId: number): string {
    const count = this.getOpenIssueCount(projectId)
    if (count === 0) return '#dcfce7'
    if (count <= 5) return '#fef9c3'
    return '#ffe4e6'
  }

  getIssuesTextColor(projectId: number): string {
    const count = this.getOpenIssueCount(projectId)
    if (count === 0) return '#16a34a'
    if (count <= 5) return '#a16207'
    return '#be123c'
  }

  private loadProjects() {
    this.isLoading.set(true)
    this.errorMessage.set('')
    this.projectsApi.listProjects(0, 1000).subscribe({
      next: (page) => {
        this.allProjects.set(page.items)
        this.isLoading.set(false)
        this.loadOpenIssueCounts(page.items)
      },
      error: () => {
        this.errorMessage.set('Unable to load projects.')
        this.isLoading.set(false)
      }
    })
  }

  private loadOpenIssueCounts(projects: ProjectDto[]) {
    for (const project of projects) {
      this.issuesApi.listIssues(project.id, { status: 'OPEN', page: 0, size: 1 }).subscribe({
        next: (page) => {
          this.openIssueCounts.update(counts => ({ ...counts, [project.id]: page.totalElements }))
        }
      })
    }
  }

  onOpenProject(project: ProjectDto): void {
    this.router.navigate(['/app/projects', project.id, 'issues'])
  }
}
