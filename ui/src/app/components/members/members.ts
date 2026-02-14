import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ProjectsApi } from '../../features/projects/data/projects.api';
import { MembershipDto, PageResponse } from '../../models/api.models';

// Define member and invited user interfaces
interface MemberRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  dateAdded: string;
  avatar?: string;
}

@Component({
  selector: 'members',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './members.html',
  styleUrls: ['./members.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class Members implements OnInit {
  // Search and filter form
  searchForm: FormGroup;
  inviteForm: FormGroup;

  activeMembers: MemberRow[] = [];
  invitedUsers: MemberRow[] = [];
  membersPage: PageResponse<MembershipDto> | null = null;
  errorMessage = '';
  isLoading = false;
  projectId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectsApi: ProjectsApi
  ) {
    // Initialize search and filter form
    this.searchForm = this.formBuilder.group({
      searchMembers: [''],
      roleFilter: ['All Roles'],
      statusFilter: ['All Status']
    });

    // Initialize invite form
    this.inviteForm = this.formBuilder.group({
      email: [''],
      role: ['Member']
    });
  }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (!Number.isNaN(projectId)) {
      this.projectId = projectId;
      this.loadMembers(0);
    }
  }

  /**
   * Handles the search functionality for members
   */
  onSearchMembers(): void {
    const searchTerm = this.searchForm.get('searchMembers')?.value.toLowerCase();
    console.log('Searching for:', searchTerm);
  }

  /**
   * Handles role filter change
   */
  onRoleFilterChange(): void {
    const selectedRole = this.searchForm.get('roleFilter')?.value;
    console.log('Filtering by role:', selectedRole);
  }

  /**
   * Handles status filter change
   */
  onStatusFilterChange(): void {
    const selectedStatus = this.searchForm.get('statusFilter')?.value;
    console.log('Filtering by status:', selectedStatus);
  }

  /**
   * Invites a new member to the project
   */
  onInviteMember(): void {
    if (!this.projectId) {
      return;
    }
    if (this.inviteForm.valid) {
      const email = this.inviteForm.get('email')?.value;
      this.projectsApi.inviteMember(this.projectId, { email }).subscribe({
        next: () => {
          this.inviteForm.reset({ role: 'Member' });
          this.loadMembers(0);
        },
        error: () => {
          this.errorMessage = 'Unable to invite member.';
        }
      });
    }
  }

  /**
   * Opens invite members dialog
   */
  openInviteDialog(): void {
    if (!this.projectId) {
      return;
    }
    this.router.navigate(['/app/projects', this.projectId, 'members', 'invite']);
  }

  /**
   * Handles member action (e.g., edit, remove)
   */
  onMemberAction(memberId: string, action: string): void {
    console.log(`Performing ${action} action on member:`, memberId);
  }

  /**
   * Handles invited user action (e.g., resend invite, remove)
   */
  onInvitedUserAction(userId: string, action: string): void {
    console.log(`Performing ${action} action on invited user:`, userId);
  }

  /**
   * Loads previous page
   */
  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMembers(this.currentPage - 1);
    }
  }

  /**
   * Loads next page
   */
  onNextPage(): void {
    const maxPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < maxPages) {
      this.currentPage++;
      this.loadMembers(this.currentPage - 1);
    }
  }

  /**
   * Get display text for pagination
   */
  getPaginationText(): string {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${startItem} to ${endItem} of ${this.totalItems} members`;
  }

  get filteredActiveMembers(): MemberRow[] {
    const searchTerm = (this.searchForm.get('searchMembers')?.value || '').toLowerCase();
    return this.activeMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm)
    );
  }

  get filteredInvitedUsers(): MemberRow[] {
    const searchTerm = (this.searchForm.get('searchMembers')?.value || '').toLowerCase();
    return this.invitedUsers.filter(member =>
      member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm)
    );
  }

  private loadMembers(page: number): void {
    if (!this.projectId) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.projectsApi.listMembers(this.projectId, page, this.itemsPerPage).subscribe({
      next: (pageResult) => {
        this.membersPage = pageResult;
        this.totalItems = pageResult.totalElements;
        this.currentPage = pageResult.page + 1;
        const mapped = pageResult.items.map((member) => this.mapMember(member));
        this.activeMembers = mapped.filter(member => member.status === 'ACTIVE');
        this.invitedUsers = mapped.filter(member => member.status === 'INVITED');
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load members.';
        this.isLoading = false;
      }
    });
  }

  private mapMember(member: MembershipDto): MemberRow {
    const displayName = member.userId ? `User ${member.userId}` : member.invitedEmail || 'Invited user';
    return {
      id: String(member.id),
      name: displayName,
      email: member.invitedEmail || (member.userId ? `user${member.userId}@example.com` : ''),
      role: member.role,
      status: member.status,
      dateAdded: member.createdAt,
      avatar: undefined
    };
  }
}
