import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
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
  imports: [CommonModule, SidebarComponent, IssueRowComponent],
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly issuesApi: IssuesApi,
    private readonly projectsApi: ProjectsApi
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId.set(projectId)
      this.loadProject(projectId)
      this.loadIssues(projectId)
    }
  }

  get issueRows(): IssueDto[] {
    return this.issuesPage()?.items ?? []
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

  private loadIssues(projectId: number) {
    this.isLoading.set(true)
    this.errorMessage.set('')
    this.issuesApi.listIssues(projectId, { page: 0, size: 10 }).subscribe({
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
