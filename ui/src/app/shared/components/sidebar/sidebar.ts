import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

interface RecentProject {
  initials: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'assets/i.svg', route: '/dashboard', active: false },
    { label: 'Projects', icon: 'assets/i1.svg', route: '/projects', active: true },
    { label: 'Members', icon: 'assets/i2.svg', route: '/members', active: false },
    { label: 'Analytics', icon: 'assets/i3.svg', route: '/analytics', active: false },
    { label: 'Settings', icon: 'assets/i4.svg', route: '/settings', active: false },
  ];

  recentProjects: RecentProject[] = [
    { initials: 'WA', name: 'Web Application', color: '#dbeafe' },
    { initials: 'MA', name: 'Mobile App', color: '#dcfce7' },
    { initials: 'DS', name: 'Design System', color: '#f3e8ff' },
  ];

  userInfo = {
    name: 'John Smith',
    email: 'john@company.com',
    avatar: 'assets/img.svg',
  };

  navigateTo(route: string) {
    // Handle navigation
    console.log('Navigate to:', route);
  }

  openUserMenu() {
    // Handle user menu
    console.log('Open user menu');
  }
}
