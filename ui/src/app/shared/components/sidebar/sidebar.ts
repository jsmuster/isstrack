/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/state/auth.store'
import { AuthService } from '../../../core/auth/auth.service'
import { SidebarStore } from '../../../core/state/sidebar.store'

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
  showUserMenu = false
  menuPopupBottom = 0
  menuPopupLeft = 0

  @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>

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
    private readonly router: Router,
    readonly sidebarStore: SidebarStore
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

  toggleUserMenu(event: Event): void {
    event.stopPropagation()
    if (!this.showUserMenu && this.menuButton) {
      const rect = this.menuButton.nativeElement.getBoundingClientRect()
      this.menuPopupBottom = window.innerHeight - rect.top + 8
      this.menuPopupLeft = rect.left - 60
    }
    this.showUserMenu = !this.showUserMenu
  }

  onLogout(): void {
    this.showUserMenu = false
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  toggleSidebar(): void {
    this.sidebarStore.toggleSidebar()
  }
}
