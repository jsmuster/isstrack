import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card';

interface Project {
  div: string;
  eCommercePlatform: string;
  oWNER: string;
  johndoecompanycom: string;
  createdOnMar152024: string;
  mainECommerceApplicationWith: string;
  i: string;
  openIssues: string;
  i1: string;
  active: string;
  spanBackgroundColor: string;
  spanPadding: string;
  oWNERColor: string;
  divGap: string;
  divMinWidth: string;
  spanPadding1: string;
  spanBackgroundColor1: string;
  openIssuesColor: string;
  activeColor: string;
}

@Component({
  selector: 'projects-page-project-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ProjectCardComponent],
  templateUrl: './projects-page-project-list.html',
  styleUrls: ['./projects-page-project-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsPageProjectList {
  searchIssuesQuery = signal('');
  searchProjectsQuery = signal('');
  role = 'OWNER';
  viewMode = signal<'grid' | 'table'>('grid');
  filterBy = signal('All Projects');
  sortBy = signal('Recently Updated');
  currentPage = signal(1);

  // Mock project data
  divItems = signal<Project[]>([
    {
      div: 'assets/div2.svg',
      eCommercePlatform: 'E-commerce Platform',
      oWNER: 'OWNER',
      johndoecompanycom: 'john.doe@company.com',
      createdOnMar152024: 'Created on Mar 15, 2024',
      mainECommerceApplicationWith: 'Main e-commerce application with user management and payment processing.',
      i: 'assets/i10.svg',
      openIssues: ' 12 Open Issues',
      i1: 'assets/i11.svg',
      active: ' Active',
      spanBackgroundColor: '#dcfce7',
      spanPadding: '4px 9.1px 5px',
      oWNERColor: '#166534',
      divGap: '10.9px',
      divMinWidth: '180px',
      spanPadding1: '4px 14.6px 4px 8px',
      spanBackgroundColor1: '#fee2e2',
      openIssuesColor: '#991b1b',
      activeColor: '#16a34a'
    },
    {
      div: 'assets/div3.svg',
      eCommercePlatform: 'Mobile App Backend',
      oWNER: 'MEMBER',
      johndoecompanycom: 'sarah.wilson@company.com',
      createdOnMar152024: 'Created on Feb 28, 2024',
      mainECommerceApplicationWith: 'API services and backend infrastructure for mobile applications.',
      i: 'assets/i10.svg',
      openIssues: ' 8 Open Issues',
      i1: 'assets/i11.svg',
      active: ' Active',
      spanBackgroundColor: '#dbeafe',
      spanPadding: '4px 9px 5px',
      oWNERColor: '#1e40af',
      divGap: '15.8px',
      divMinWidth: '175px',
      spanPadding1: '4px 13.8px 4px 8px',
      spanBackgroundColor1: '',
      openIssuesColor: '',
      activeColor: ''
    },
    {
      div: 'assets/div4.svg',
      eCommercePlatform: 'Analytics Dashboard',
      oWNER: 'OWNER',
      johndoecompanycom: 'john.doe@company.com',
      createdOnMar152024: 'Created on Jan 10, 2024',
      mainECommerceApplicationWith: 'Business intelligence and reporting dashboard for stakeholders.',
      i: 'assets/i13.svg',
      openIssues: ' 3 Open Issues',
      i1: 'assets/i11.svg',
      active: ' Active',
      spanBackgroundColor: '',
      spanPadding: '',
      oWNERColor: '',
      divGap: '15.8px',
      divMinWidth: '175px',
      spanPadding1: '4px 13.7px 4px 8px',
      spanBackgroundColor1: '#fef9c3',
      openIssuesColor: '#854d0e',
      activeColor: ''
    },
    {
      div: 'assets/div5.svg',
      eCommercePlatform: 'User Management',
      oWNER: 'MEMBER',
      johndoecompanycom: 'mike.chen@company.com',
      createdOnMar152024: 'Created on Dec 5, 2023',
      mainECommerceApplicationWith: 'Authentication, authorization, and user profile management system.',
      i: 'assets/i14.svg',
      openIssues: ' 0 Open Issues',
      i1: 'assets/i15.svg',
      active: ' Inactive',
      spanBackgroundColor: '#dbeafe',
      spanPadding: '4px 9px 5px',
      oWNERColor: '#1e40af',
      divGap: '6.8px',
      divMinWidth: '184px',
      spanPadding1: '4px 14px 4px 8px',
      spanBackgroundColor1: '#dcfce7',
      openIssuesColor: '#166534',
      activeColor: '#6b7280'
    },
    {
      div: 'assets/div6.svg',
      eCommercePlatform: 'Security Audit',
      oWNER: 'OWNER',
      johndoecompanycom: 'john.doe@company.com',
      createdOnMar152024: 'Created on Nov 20, 2023',
      mainECommerceApplicationWith: 'Security assessment and vulnerability tracking for all applications.',
      i: 'assets/i10.svg',
      openIssues: ' 5 Open Issues',
      i1: 'assets/i11.svg',
      active: ' Active',
      spanBackgroundColor: '',
      spanPadding: '',
      oWNERColor: '',
      divGap: '16.1px',
      divMinWidth: '175px',
      spanPadding1: '4px 14.5px 4px 8px',
      spanBackgroundColor1: '',
      openIssuesColor: '',
      activeColor: ''
    },
    {
      div: 'assets/div7.svg',
      eCommercePlatform: 'Data Migration',
      oWNER: 'MEMBER',
      johndoecompanycom: 'alex.rodriguez@company.com',
      createdOnMar152024: 'Created on Oct 15, 2023',
      mainECommerceApplicationWith: 'Legacy system data migration and database optimization project.',
      i: 'assets/i13.svg',
      openIssues: ' 2 Open Issues',
      i1: 'assets/i15.svg',
      active: ' Inactive',
      spanBackgroundColor: '#dbeafe',
      spanPadding: '4px 9px 5px',
      oWNERColor: '#1e40af',
      divGap: '7.2px',
      divMinWidth: '',
      spanPadding1: '4px 13.6px 4px 8px',
      spanBackgroundColor1: '#fef9c3',
      openIssuesColor: '#854d0e',
      activeColor: '#6b7280'
    }
  ]);

  onSearchIssues(query: string) {
    this.searchIssuesQuery.set(query);
    console.log('Search issues:', query);
  }

  onSearchProjects(query: string) {
    this.searchProjectsQuery.set(query);
    console.log('Search projects:', query);
  }

  toggleViewMode(mode: 'grid' | 'table') {
    this.viewMode.set(mode);
    console.log('View mode:', mode);
  }

  onFilterChange(filter: string) {
    this.filterBy.set(filter);
    console.log('Filter:', filter);
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort);
    console.log('Sort:', sort);
  }

  onNewProject() {
    console.log('Create new project');
  }

  onNotificationClick() {
    console.log('Notification clicked');
  }

  onSettingsClick() {
    console.log('Settings clicked');
  }
}
