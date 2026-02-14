import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ProjectsApi } from '../../features/projects/data/projects.api';

@Component({
  selector: 'projects-page-no-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './projects-page-no-projects.html',
  styleUrls: ['./projects-page-no-projects.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsPageNoProjects {
  searchQuery = '';
  role = 'OWNER';
  showNotifications = false
  notifications = [
    { id: 'notif-1', message: 'Welcome to IssueTracker', time: 'Just now' },
    { id: 'notif-2', message: 'Invite teammates to get started', time: '5m ago' },
  ]

  constructor(private readonly projectsApi: ProjectsApi, private readonly router: Router) {}

  onSearch(query: string) {
    this.searchQuery = query;
    console.log('Search:', query);
  }

  onNewProject() {
    this.createProject();
  }

  onCreateFirstProject() {
    this.createProject();
  }

  onViewGettingStarted() {
    console.log('View getting started guide');
  }

  onNotificationClick() {
    this.showNotifications = !this.showNotifications
  }

  onSettingsClick() {
    console.log('Settings clicked');
  }

  private createProject(): void {
    const name = window.prompt('Project name')
    if (!name) {
      return
    }
    this.projectsApi.createProject({ name }).subscribe({
      next: (project) => {
        this.router.navigate(['/app/projects', project.id, 'issues'])
      }
    })
  }
}
