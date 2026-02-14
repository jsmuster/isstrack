import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectCardComponent } from '../../shared/components/project-card/project-card'
import { CreateNewProjectModalComponent } from '../create-new-project-modal/create-new-project-modal.component'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { PageResponse, ProjectDto } from '../../models/api.models'
import { debounceTime, Subject } from 'rxjs'

@Component({
  selector: 'projects-page-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ProjectCardComponent, CreateNewProjectModalComponent],
  templateUrl: './projects-page-project-list.html',
  styleUrls: ['./projects-page-project-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageProjectList implements OnInit {
  searchIssuesQuery = ''
  searchProjectsQuery = ''
  role = 'OWNER'
  viewMode = signal<'grid' | 'table'>('grid')
  filterBy = signal<'all' | 'owned' | 'shared'>('all')
  sortBy = signal<'recently-updated' | 'oldest-first'>('recently-updated')
  currentPage = signal(1)
  projectsPage = signal<PageResponse<ProjectDto> | null>(null)
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

  private searchSubject = new Subject<string>()

  constructor(private readonly projectsApi: ProjectsApi, private readonly router: Router) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.currentPage.set(1)
      this.loadProjects(0)
    })
    this.loadProjects(0)
  }

  get hasProjects(): boolean {
    return (this.projectsPage()?.totalElements ?? 0) > 0
  }

  get projects(): ProjectDto[] {
    return this.projectsPage()?.items ?? []
  }

  onSearchIssues(query: string) {
    this.searchIssuesQuery = query
  }

  onSearchProjects(query: string) {
    this.searchProjectsQuery = query
    this.searchSubject.next(query)
  }

  trackProject(index: number, project: ProjectDto): number {
    return project.id
  }

  toggleViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode)
  }

  onFilterChange(filter: 'all' | 'owned' | 'shared') {
    this.filterBy.set(filter)
    this.currentPage.set(1)
    this.loadProjects(0)
  }

  onSortChange(sort: 'recently-updated' | 'oldest-first') {
    this.sortBy.set(sort)
    this.currentPage.set(1)
    this.loadProjects(0)
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

  private loadProjects(pageIndex: number) {
    this.isLoading.set(true)
    this.errorMessage.set('')
    const search = this.searchProjectsQuery.trim() || undefined
    this.projectsApi.listProjects(pageIndex, 6, search, this.sortBy(), this.filterBy()).subscribe({
      next: (page) => {
        this.projectsPage.set(page)
        this.currentPage.set(page.page + 1)
        this.isLoading.set(false)
      },
      error: () => {
        this.errorMessage.set('Unable to load projects.')
        this.isLoading.set(false)
      }
    })
  }

  onOpenProject(project: ProjectDto): void {
    this.router.navigate(['/app/projects', project.id, 'issues'])
  }

  onPrevPage(): void {
    const current = this.projectsPage()?.page ?? 0
    if (current > 0) {
      this.loadProjects(current - 1)
    }
  }

  onNextPage(): void {
    const page = this.projectsPage()
    if (!page) {
      return
    }
    if (page.page + 1 < page.totalPages) {
      this.loadProjects(page.page + 1)
    }
  }
}
