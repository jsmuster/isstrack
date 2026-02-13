import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'projects-page-no-projects',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './projects-page-no-projects.html',
  styleUrls: ['./projects-page-no-projects.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsPageNoProjects {
  searchQuery = '';
  role = 'OWNER';

  onSearch(query: string) {
    this.searchQuery = query;
    console.log('Search:', query);
  }

  onNewProject() {
    console.log('Create new project');
  }

  onCreateFirstProject() {
    console.log('Create first project');
  }

  onViewGettingStarted() {
    console.log('View getting started guide');
  }

  onNotificationClick() {
    console.log('Notification clicked');
  }

  onSettingsClick() {
    console.log('Settings clicked');
  }
}
