import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectCardComponent } from '../../shared/components/project-card/project-card'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { PageResponse, ProjectDto } from '../../models/api.models'

@Component({
  selector: 'projects-page-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ProjectCardComponent],
  templateUrl: './projects-page-project-list.html',
  styleUrls: ['./projects-page-project-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsPageProjectList implements OnInit {
  searchIssuesQuery = ''
  searchProjectsQuery = ''
  role = 'OWNER'
  viewMode = signal<'grid' | 'table'>('grid')
  filterBy = signal('All Projects')
  sortBy = signal('Recently Updated')
  currentPage = signal(1)
  projectsPage = signal<PageResponse<ProjectDto> | null>(null)
  isLoading = signal(false)
  errorMessage = signal('')
  showNotifications = signal(false)
  notifications = [
    { id: 'notif-1', message: 'New project created', time: 'Just now' },
    { id: 'notif-2', message: 'Issue updated in workspace', time: '15m ago' },
  ]


  constructor(private readonly projectsApi: ProjectsApi, private readonly router: Router) {}

  ngOnInit(): void {
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
  }

  trackProject(index: number, project: ProjectDto): number {
    return project.id
  }

  toggleViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode)
  }

  onFilterChange(filter: string) {
    this.filterBy.set(filter)
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort)
  }

  onNewProject() {
    const name = window.prompt('Project name')
    if (!name) {
      return
    }
    this.projectsApi.createProject({ name }).subscribe({
      next: (project) => this.router.navigate(['/app/projects', project.id, 'issues']),
      error: () => this.errorMessage.set('Unable to create project.')
    })
  }

  onNotificationClick() {
    this.showNotifications.update((value) => !value)
  }

  onSettingsClick() {
    console.log('Settings clicked')
  }

  private loadProjects(pageIndex: number) {
    this.isLoading.set(true)
    this.errorMessage.set('')
    this.projectsApi.listProjects(pageIndex, 6).subscribe({
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
