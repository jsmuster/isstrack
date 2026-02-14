import { Component, ChangeDetectionStrategy, OnInit, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { MembershipDto, PageResponse } from '../../models/api.models'
import { AuthStore } from '../../core/state/auth.store'

// Define member and invited user interfaces
interface MemberRow {
  id: string
  name: string
  email: string
  role: string
  status: string
  dateAdded: string
  avatar?: string
}

@Component({
  selector: 'members',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './members.html',
  styleUrls: ['./members.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Members implements OnInit {
  // Search and filter form
  searchForm: FormGroup
  inviteForm: FormGroup

  activeMembers: MemberRow[] = []
  invitedUsers: MemberRow[] = []
  membersPage: PageResponse<MembershipDto> | null = null
  errorMessage = ''
  isLoading = false
  projectId: number | null = null
  showNotifications = false
  notifications = [
    { id: 'notif-1', message: 'New member invite sent', time: 'Just now' },
    { id: 'notif-2', message: 'Member role updated', time: '1h ago' },
  ]
  roleLabel = computed(() => this.authStore.currentUser()?.role ?? 'MEMBER')
  isOwner = computed(() => this.roleLabel().toUpperCase() === 'OWNER')
  totalPages = computed(() => Math.ceil(this.totalItems / this.itemsPerPage) || 1)

  // Pagination
  currentPage = 1
  itemsPerPage = 20
  totalItems = 0

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectsApi: ProjectsApi,
    private authStore: AuthStore
  ) {
    // Initialize search and filter form
    this.searchForm = this.formBuilder.group({
      searchMembers: [''],
      roleFilter: ['All Roles'],
      statusFilter: ['All Status']
    })

    // Initialize invite form
    this.inviteForm = this.formBuilder.group({
      email: [''],
      role: ['Member']
    })
  }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
    if (!Number.isNaN(projectId)) {
      this.projectId = projectId
      this.loadMembers(0)
    }
  }

  /**
   * Handles the search functionality for members
   */
  onSearchMembers(): void {}

  /**
   * Handles role filter change
   */
  onRoleFilterChange(): void {}

  /**
   * Handles status filter change
   */
  onStatusFilterChange(): void {}

  /**
   * Invites a new member to the project
   */
  onInviteMember(): void {
    if (!this.projectId) {
      return
    }
    if (this.inviteForm.valid) {
      const email = this.inviteForm.get('email')?.value
      this.projectsApi.inviteMember(this.projectId, { email }).subscribe({
        next: () => {
          this.inviteForm.reset({ role: 'Member' })
          this.loadMembers(0)
        },
        error: () => {
          this.errorMessage = 'Unable to invite member.'
        }
      })
    }
  }

  /**
   * Opens invite members dialog
   */
  openInviteDialog(): void {
    if (!this.projectId) {
      return
    }
    this.router.navigate(['/app/projects', this.projectId, 'members', 'invite'])
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications
  }

  /**
   * Handles member action (e.g., edit, remove)
   */
  onMemberAction(memberId: string, action: string): void {
    console.log(`Performing ${action} action on member:`, memberId)
  }

  /**
   * Handles invited user action (e.g., resend invite, remove)
   */
  onInvitedUserAction(userId: string, action: string): void {
    console.log(`Performing ${action} action on invited user:`, userId)
  }

  /**
   * Loads previous page
   */
  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.loadMembers(this.currentPage - 1)
    }
  }

  /**
   * Loads next page
   */
  onNextPage(): void {
    const maxPages = Math.ceil(this.totalItems / this.itemsPerPage)
    if (this.currentPage < maxPages) {
      this.currentPage++
      this.loadMembers(this.currentPage - 1)
    }
  }

  /**
   * Get display text for pagination
   */
  getPaginationText(): string {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
    return `Showing ${startItem} to ${endItem} of ${this.totalItems} members`
  }

  get filteredActiveMembers(): MemberRow[] {
    const searchTerm = (this.searchForm.get('searchMembers')?.value || '').toLowerCase()
    const roleFilter = this.searchForm.get('roleFilter')?.value || 'All Roles'
    const statusFilter = this.searchForm.get('statusFilter')?.value || 'All Status'
    return this.activeMembers.filter(member =>
      (member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm)) &&
      (roleFilter === 'All Roles' || member.role.toLowerCase() === roleFilter.toLowerCase()) &&
      (statusFilter === 'All Status' || member.status.toLowerCase() === statusFilter.toLowerCase())
    )
  }

  get filteredInvitedUsers(): MemberRow[] {
    const searchTerm = (this.searchForm.get('searchMembers')?.value || '').toLowerCase()
    const roleFilter = this.searchForm.get('roleFilter')?.value || 'All Roles'
    const statusFilter = this.searchForm.get('statusFilter')?.value || 'All Status'
    return this.invitedUsers.filter(member =>
      (member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm)) &&
      (roleFilter === 'All Roles' || member.role.toLowerCase() === roleFilter.toLowerCase()) &&
      (statusFilter === 'All Status' || member.status.toLowerCase() === statusFilter.toLowerCase())
    )
  }

  private loadMembers(page: number): void {
    if (!this.projectId) {
      return
    }
    this.isLoading = true
    this.errorMessage = ''
    this.projectsApi.listMembers(this.projectId, page, this.itemsPerPage).subscribe({
      next: (pageResult) => {
        this.membersPage = pageResult
        this.totalItems = pageResult.totalElements
        this.currentPage = pageResult.page + 1
        const mapped = pageResult.items.map((member) => this.mapMember(member))
        this.activeMembers = mapped.filter(member => member.status === 'ACTIVE')
        this.invitedUsers = mapped.filter(member => member.status === 'INVITED')
        this.isLoading = false
      },
      error: () => {
        this.errorMessage = 'Unable to load members.'
        this.isLoading = false
      }
    })
  }

  private mapMember(member: MembershipDto): MemberRow {
    const displayName = member.userId ? `User ${member.userId}` : member.invitedEmail || 'Invited user'
    const displayRole = this.formatRole(member.role)
    const displayStatus = this.formatStatus(member.status)
    const avatar = displayStatus === 'Invited' ? '/assets/images/div2.svg' : '/assets/images/img.svg'
    return {
      id: String(member.id),
      name: displayName,
      email: member.invitedEmail || (member.userId ? `user${member.userId}@example.com` : ''),
      role: displayRole,
      status: displayStatus,
      dateAdded: member.createdAt,
      avatar
    }
  }

  private formatRole(role: string): string {
    return role.toUpperCase() === 'OWNER' ? 'Owner' : 'Member'
  }

  private formatStatus(status: string): string {
    return status.toUpperCase() === 'INVITED' ? 'Invited' : 'Active'
  }
}
