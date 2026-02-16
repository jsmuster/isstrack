/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { CreateNewProjectModalComponent } from '../create-new-project-modal/create-new-project-modal.component';
import { ProjectDto } from '../../models/api.models';

@Component({
  selector: 'projects-page-no-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, CreateNewProjectModalComponent],
  templateUrl: './projects-page-no-projects.html',
  styleUrls: ['./projects-page-no-projects.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageNoProjects {
  searchQuery = '';
  role = 'OWNER';
  showNotifications = false
  isCreateProjectOpen = signal(false)
  notifications = [
    { id: 'notif-1', message: 'Welcome to IssueTracker', time: 'Just now' },
    { id: 'notif-2', message: 'Invite teammates to get started', time: '5m ago' },
  ]

  constructor(private readonly router: Router) {}

  onSearch(query: string) {
    this.searchQuery = query;
    console.log('Search:', query);
  }

  onNewProject() {
    this.isCreateProjectOpen.set(true)
  }

  onCreateFirstProject() {
    this.isCreateProjectOpen.set(true)
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

  onCreateProjectClosed(): void {
    this.isCreateProjectOpen.set(false)
  }

  onProjectCreated(project: ProjectDto): void {
    this.isCreateProjectOpen.set(false)
    this.router.navigate(['/app/projects', project.id, 'issues'])
  }
}
