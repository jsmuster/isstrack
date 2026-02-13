import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { IssueRowComponent } from '../../shared/components/issue-row/issue-row';

interface Issue {
  prop: string;
  title: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  img: string;
  assignee: string;
  time: string;
  borderBottom: string;
  padding: string;
  titleFlex: string | number;
  categoryPadding: string;
  categoryColor: string;
  categoryFlex: string | number;
  categoryDisplay: string;
  typeWidth: string;
  typeColor: string;
  typeDisplay: string;
  typeFlex: string | number;
  statusBgColor: string;
  statusPadding: string;
  statusColor: string;
  priorityBgColor: string;
  priorityPadding: string;
  priorityColor: string;
  assigneeOverflow: string;
  assigneeColor: string;
  timelineFlex: string | number;
}

@Component({
  selector: 'projects-project',
  standalone: true,
  imports: [CommonModule, SidebarComponent, IssueRowComponent],
  templateUrl: './projects-project.html',
  styleUrls: ['./projects-project.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectsProject {
  projectName = signal('E-commerce Platform');
  projectDescription = signal('Main e-commerce application with user management and payment processing.');
  role = signal('OWNER');
  searchQuery = signal('');
  activeTab = signal('issues');
  filterStatus = signal('All Status');
  filterPriority = signal('All Priority');
  filterAssignees = signal('All Assignees');
  sortBy = signal('Sort: Updated');
  currentPage = signal(1);
  totalIssues = signal(47);

  issues = signal<Issue[]>([
    {
      prop: '#1247',
      title: 'Login page not responsive on mobile devices',
      category: 'frontend',
      type: 'bug',
      status: 'In Progress',
      priority: 'High',
      img: 'assets/img1.svg',
      assignee: 'Sarah Johnson',
      time: '2 hours ago',
      borderBottom: '1px solid #e5e7eb',
      padding: '1px 4px 0px 0px',
      titleFlex: 1,
      categoryPadding: '2px 212.6px 2px 0px',
      categoryColor: '#1d4ed8',
      categoryFlex: 1,
      categoryDisplay: '',
      typeWidth: '21px',
      typeColor: '#7e22ce',
      typeDisplay: 'inline-block',
      typeFlex: '',
      statusBgColor: '#fef9c3',
      statusPadding: '4px 14.9px 5px 22px',
      statusColor: '#854d0e',
      priorityBgColor: '#fee2e2',
      priorityPadding: '4px 10.8px 5px',
      priorityColor: '#991b1b',
      assigneeOverflow: 'hidden',
      assigneeColor: '#374151',
      timelineFlex: ''
    },
    {
      prop: '#1246',
      title: 'Add dark mode support to dashboard',
      category: 'feature',
      type: 'ui',
      status: 'Open',
      priority: 'Low',
      img: 'assets/img2.svg',
      assignee: 'Mike Chen',
      time: '5 hours ago',
      borderBottom: '',
      padding: '1px 3px 0px 0px',
      titleFlex: '',
      categoryPadding: '2px 180.1px 2px 0px',
      categoryColor: '#15803d',
      categoryFlex: '',
      categoryDisplay: '',
      typeWidth: '10px',
      typeColor: '#1d4ed8',
      typeDisplay: '',
      typeFlex: '',
      statusBgColor: '#dbeafe',
      statusPadding: '4px 11.9px 5px 22px',
      statusColor: '#1e40af',
      priorityBgColor: '#f3f4f6',
      priorityPadding: '4px 10.4px 5px',
      priorityColor: '#1f2937',
      assigneeOverflow: '',
      assigneeColor: '',
      timelineFlex: ''
    },
    {
      prop: '#1245',
      title: 'Database performance optimization needed',
      category: 'backend',
      type: 'performance',
      status: 'Resolved',
      priority: 'Critical',
      img: 'assets/img3.svg',
      assignee: 'John Smith',
      time: '1 day ago',
      borderBottom: '',
      padding: '',
      titleFlex: '',
      categoryPadding: '2px 0px',
      categoryColor: '#c2410c',
      categoryFlex: 'unset',
      categoryDisplay: '',
      typeWidth: 'unset',
      typeColor: '#b91c1c',
      typeDisplay: 'unset',
      typeFlex: '',
      statusBgColor: '#dcfce7',
      statusPadding: '4px 13.6px 5px 22px',
      statusColor: '#166534',
      priorityBgColor: '#ffedd5',
      priorityPadding: '4px 11.8px 5px',
      priorityColor: '#9a3412',
      assigneeOverflow: '',
      assigneeColor: '',
      timelineFlex: 1
    },
    {
      prop: '#1244',
      title: 'Implement user authentication with OAuth',
      category: 'auth',
      type: 'feature',
      status: 'In Progress',
      priority: 'Medium',
      img: 'assets/img4.svg',
      assignee: 'Alex Rivera',
      time: '2 days ago',
      borderBottom: '',
      padding: '1px 3px 0px 0px',
      titleFlex: '',
      categoryPadding: '2px 0px',
      categoryColor: '#7e22ce',
      categoryFlex: '',
      categoryDisplay: 'inline-block',
      typeWidth: 'unset',
      typeColor: '#15803d',
      typeDisplay: 'unset',
      typeFlex: 1,
      statusBgColor: '',
      statusPadding: '',
      statusColor: '',
      priorityBgColor: '#fef9c3',
      priorityPadding: '4px 11.2px 5px',
      priorityColor: '#854d0e',
      assigneeOverflow: '',
      assigneeColor: '',
      timelineFlex: 1
    },
    {
      prop: '#1243',
      title: 'Fix broken links in documentation',
      category: 'docs',
      type: 'bug',
      status: 'Open',
      priority: 'Low',
      img: 'assets/div2.svg',
      assignee: 'Unassigned',
      time: '3 days ago',
      borderBottom: '',
      padding: '1px 3px 0px 0px',
      titleFlex: 'unset',
      categoryPadding: '2px 155.6px 2px 0px',
      categoryColor: '#4338ca',
      categoryFlex: '',
      categoryDisplay: '',
      typeWidth: '',
      typeColor: '',
      typeDisplay: '',
      typeFlex: '',
      statusBgColor: '#dbeafe',
      statusPadding: '4px 11.9px 5px 22px',
      statusColor: '#1e40af',
      priorityBgColor: '#f3f4f6',
      priorityPadding: '4px 10.4px 5px',
      priorityColor: '#1f2937',
      assigneeOverflow: 'unset',
      assigneeColor: '#6b7280',
      timelineFlex: 1
    },
    {
      prop: '#1242',
      title: 'Update dependencies to latest versions',
      category: 'maintenance',
      type: 'dependencies',
      status: 'Closed',
      priority: 'Medium',
      img: 'assets/img2.svg',
      assignee: 'Mike Chen',
      time: '1 week ago',
      borderBottom: 'unset',
      padding: '1px 3px 0px 0px',
      titleFlex: '',
      categoryPadding: '2px 0px',
      categoryColor: '#374151',
      categoryFlex: 'unset',
      categoryDisplay: '',
      typeWidth: 'unset',
      typeColor: '#c2410c',
      typeDisplay: 'unset',
      typeFlex: '',
      statusBgColor: '#e5e7eb',
      statusPadding: '4px 12px 5px 22px',
      statusColor: '#1f2937',
      priorityBgColor: '#fef9c3',
      priorityPadding: '4px 11.2px 5px',
      priorityColor: '#854d0e',
      assigneeOverflow: '',
      assigneeColor: '',
      timelineFlex: 1
    }
  ]);

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  switchTab(tab: string) {
    this.activeTab.set(tab);
  }

  onFilterStatus(status: string) {
    this.filterStatus.set(status);
  }

  onFilterPriority(priority: string) {
    this.filterPriority.set(priority);
  }

  onFilterAssignees(assignees: string) {
    this.filterAssignees.set(assignees);
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort);
  }

  onNewIssue() {
    console.log('Create new issue');
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
