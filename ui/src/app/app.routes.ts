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

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: CreateAccountPage },
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
