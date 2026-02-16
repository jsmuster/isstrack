/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { ProjectDto } from '../../models/api.models'

@Component({
  selector: 'projects-project',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './projects-project.html',
  styleUrls: ['./projects-project.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsProject implements OnInit {
  project = signal<ProjectDto | null>(null)
  errorMessage = signal('')
  projectId: number | null = null

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectsApi: ProjectsApi
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId = projectId
      this.loadProject(projectId)
    }
  }

  onGoToIssues(): void {
    if (this.projectId === null) {
      return
    }
    this.router.navigate(['/app/projects', this.projectId, 'issues'])
  }

  onGoToMembers(): void {
     if (this.projectId === null) {
       return
     }
     this.router.navigate(['/app/projects', this.projectId, 'members'])
   }

   onGoBack(): void {
     this.router.navigate(['/app/projects'])
   }

   private loadProject(projectId: number): void {
    this.projectsApi.getProject(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: () => this.errorMessage.set('Unable to load project details.')
    })
  }
}
