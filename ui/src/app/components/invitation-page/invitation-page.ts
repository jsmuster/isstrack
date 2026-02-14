import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { ProjectsApi } from '../../features/projects/data/projects.api'

type InviteStatus = 'ready' | 'accepted' | 'error'

@Component({
  selector: 'invitation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitation-page.html',
  styleUrls: ['./invitation-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationPage implements OnInit {
  inviteStatus: InviteStatus = 'ready'
  inviteProjectName = ''
  errorMessage = ''
  isSubmitting = false

  private inviteToken: string | null = null

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectsApi: ProjectsApi
  ) {}

  ngOnInit(): void {
    this.inviteToken = this.route.snapshot.queryParamMap.get('token')
    this.inviteProjectName = this.route.snapshot.queryParamMap.get('project') ?? ''

    if (!this.inviteToken) {
      this.inviteStatus = 'error'
      this.errorMessage = 'Invitation link is missing or invalid.'
    }
  }

  onAcceptInvite(): void {
    if (!this.inviteToken || this.isSubmitting) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ''

    this.projectsApi.acceptInvite({ token: this.inviteToken }).subscribe({
      next: (membership) => {
        this.inviteStatus = 'accepted'
        this.isSubmitting = false
        this.router.navigate(['/app/projects', membership.projectId])
      },
      error: () => {
        this.inviteStatus = 'error'
        this.errorMessage = 'Unable to accept the invitation. Please try again.'
        this.isSubmitting = false
      }
    })
  }

  onBackToLogin(): void {
    this.router.navigate(['/login'])
  }
}
