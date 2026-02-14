import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/state/auth.store'
import { AuthService } from '../../../core/auth/auth.service'

interface NavItem {
  label: string
  icon: string
  route: string
}

interface RecentProject {
  initials: string
  name: string
  color: string
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
    { label: 'Projects', icon: 'assets/i1.svg', route: '/app/projects' },
  ]

  recentProjects: RecentProject[] = []

  userInfo = {
    name: 'User',
    email: '',
    avatar: 'assets/img.svg',
  }

  constructor(
    private readonly authStore: AuthStore,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    const user = this.authStore.currentUser()
    if (user) {
      this.userInfo = {
        name: user.username || user.email || 'User',
        email: user.email || '',
        avatar: 'assets/img.svg',
      }
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route])
  }

  onLogout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
