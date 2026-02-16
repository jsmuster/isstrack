/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router'
import { AuthGuard } from './core/guards/auth.guard'
import { LoginPage } from './components/login-page/login-page'
import { CreateAccountPage } from './components/create-account-page/create-account-page'
import { ProjectsPageNoProjects } from './components/projects-page-no-projects/projects-page-no-projects'
import { ProjectsPageProjectList } from './components/projects-page-project-list/projects-page-project-list'
import { ProjectsProject } from './components/projects-project/projects-project'
import { ProjectsProjectIssueList } from './components/projects-project-issue-list/projects-project-issue-list'
import { IssueDetails } from './components/issue-details/issue-details'
import { InviteMembers } from './components/invite-members/invite-members'
import { InvitationPage } from './components/invitation-page/invitation-page'
import { ProjectsProjectMembers } from './components/projects-project-members/projects-project-members'
import { ForgotYourPasswordComponent } from './components/forgot-your-password/forgot-your-password.component'
import { CheckYourEmailComponent } from './components/check-your-email/check-your-email.component'
import { ResetLinkExpiredComponent } from './components/reset-link-expired/reset-link-expired.component'
import { SetANewPasswordComponent } from './components/set-a-new-password/set-a-new-password.component'
import { PasswordUpdatedComponent } from './components/password-updated/password-updated.component'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: CreateAccountPage },
  { path: 'forgot-password', component: ForgotYourPasswordComponent },
  { path: 'check-your-email', component: CheckYourEmailComponent },
  { path: 'reset-link-expired', component: ResetLinkExpiredComponent },
  { path: 'set-a-new-password', component: SetANewPasswordComponent },
  { path: 'password-updated', component: PasswordUpdatedComponent },
  { path: 'invites/accept', component: InvitationPage },
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: ProjectsPageProjectList },
      { path: 'projects-empty', component: ProjectsPageNoProjects },
      { path: 'projects/:projectId', component: ProjectsProject },
      { path: 'projects/:projectId/issues', component: ProjectsProjectIssueList },
      { path: 'projects/:projectId/issues/:issueId', component: IssueDetails },
      { path: 'projects/:projectId/members', component: ProjectsProjectMembers },
      { path: 'projects/:projectId/members/invite', component: InviteMembers }
    ]
  }
]
