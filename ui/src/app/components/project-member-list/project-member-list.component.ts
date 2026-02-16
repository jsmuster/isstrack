/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, Input, OnChanges, OnInit, SimpleChanges, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { MembershipDto, PageResponse } from '../../models/api.models'
import { ProjectsApi } from '../../features/projects/data/projects.api'

interface MemberRow {
  id: string
  name: string
  email: string
  role: string
  status: string
  dateAdded: string
  avatar?: string
}

/**
 * ProjectMemberListComponent
 * Displays active and invited members of a project
 * Provides search and filter functionality for members by role and status
 */
@Component({
  selector: 'app-project-member-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-member-list.component.html',
  styleUrls: ['./project-member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectMemberListComponent implements OnInit, OnChanges {
  @Input() projectId: number | null = null

  activeMembers = signal<MemberRow[]>([])
  invitedUsers = signal<MemberRow[]>([])
  membersPage = signal<PageResponse<MembershipDto> | null>(null)
  searchTerm = signal('')
  roleFilter = signal('All Roles')
  statusFilter = signal('All Status')
  currentPage = signal(1)
  totalItems = signal(0)
  readonly itemsPerPage = 20

  filteredActiveMembers = computed(() => this.filterMembers(this.activeMembers()))
  filteredInvitedUsers = computed(() => this.filterMembers(this.invitedUsers()))
  showingStart = computed(() => {
    const total = this.totalItems()
    if (total === 0) {
      return 0
    }
    return (this.currentPage() - 1) * this.itemsPerPage + 1
  })
  showingEnd = computed(() => Math.min(this.currentPage() * this.itemsPerPage, this.totalItems()))

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectsApi: ProjectsApi
  ) {}

  ngOnInit(): void {
    if (this.projectId === null) {
      const routeProjectId = Number(this.route.snapshot.paramMap.get('projectId'))
      if (!Number.isNaN(routeProjectId)) {
        this.projectId = routeProjectId
      }
    }

    if (this.projectId !== null) {
      this.loadMembers(0)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId !== null) {
      this.loadMembers(0)
    }
  }

  /**
   * Handle invite members button click
   */
  onInviteMembers(): void {
    if (this.projectId === null) {
      return
    }
    this.router.navigate(['/app/projects', this.projectId, 'members', 'invite'])
  }

  /**
   * Handle search input for members
   */
  onSearchMembers(_event: Event): void {
    const target = _event.target as HTMLInputElement | null
    this.searchTerm.set(target?.value ?? '')
  }

  /**
   * Handle role filter change
   */
  onRoleFilterChange(role: string): void {
    // TODO: Implement role filter functionality
    this.roleFilter.set(role)
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(status: string): void {
    // TODO: Implement status filter functionality
    this.statusFilter.set(status)
  }

  /**
   * Handle pagination - previous page
   */
  onPreviousPage(): void {
    if (this.currentPage() > 1) {
      const nextPage = this.currentPage() - 1
      this.currentPage.set(nextPage)
      this.loadMembers(nextPage - 1)
    }
  }

  /**
   * Handle pagination - next page
   */
  onNextPage(): void {
    const maxPages = Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage))
    if (this.currentPage() < maxPages) {
      const nextPage = this.currentPage() + 1
      this.currentPage.set(nextPage)
      this.loadMembers(nextPage - 1)
    }
  }

  private loadMembers(pageIndex: number): void {
    if (this.projectId === null) {
      return
    }
    this.projectsApi.listMembers(this.projectId, pageIndex, this.itemsPerPage).subscribe({
      next: (pageResult) => {
        const mapped = pageResult.items.map((member) => this.mapMember(member))
        this.activeMembers.set(mapped.filter(member => member.status === 'Active'))
        this.invitedUsers.set(mapped.filter(member => member.status === 'Invited'))
        this.membersPage.set(pageResult)
        this.totalItems.set(pageResult.totalElements)
        this.currentPage.set(pageResult.page + 1)
      }
    })
  }

  private mapMember(member: MembershipDto): MemberRow {
    const displayName = member.userId ? `User ${member.userId}` : member.invitedEmail || 'Invited user'
    const displayRole = member.role.toUpperCase() === 'OWNER' ? 'Owner' : 'Member'
    const displayStatus = member.status.toUpperCase() === 'INVITED' ? 'Invited' : 'Active'
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

  private filterMembers(members: MemberRow[]): MemberRow[] {
    const searchTerm = this.searchTerm().toLowerCase()
    const roleFilter = this.roleFilter().toLowerCase()
    const statusFilter = this.statusFilter().toLowerCase()
    return members.filter(member => {
      const matchesSearch =
        !searchTerm ||
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm)
      const matchesRole = roleFilter === 'all roles' || member.role.toLowerCase() === roleFilter
      const matchesStatus = statusFilter === 'all status' || member.status.toLowerCase() === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }
}
