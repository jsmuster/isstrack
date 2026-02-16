/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { ProjectDto } from '../../models/api.models'
import { ProjectMemberListComponent } from '../project-member-list/project-member-list.component'

/**
 * Projects - Project Members Component
 * Displays project workspace chrome with the members list content.
 */
@Component({
  selector: 'app-projects-project-members',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, ProjectMemberListComponent],
  templateUrl: './projects-project-members.html',
  styleUrls: ['./projects-project-members.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsProjectMembers implements OnInit {
  project = signal<ProjectDto | null>(null)
  errorMessage = signal('')
  projectId = signal<number | null>(null)
  showNotifications = signal(false)
  notifications = [
    { id: 'notif-1', message: 'New member invite sent', time: 'Just now' },
    { id: 'notif-2', message: 'Member role updated', time: '1h ago' },
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectsApi: ProjectsApi
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId.set(projectId)
      this.loadProject(projectId)
    }
  }

  toggleNotifications(): void {
    this.showNotifications.update((value) => !value)
  }

  onGoBack(): void {
    this.router.navigate(['/app/projects'])
  }

  private loadProject(projectId: number): void {
    this.projectsApi.getProject(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: () => this.errorMessage.set('Unable to load project.')
    })
  }
}
