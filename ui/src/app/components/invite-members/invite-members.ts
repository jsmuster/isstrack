import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ProjectsApi } from '../../features/projects/data/projects.api';

/**
 * User interface for search results
 */
interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
}

/**
 * Invited recipient interface
 */
interface InvitedRecipient {
  id: string;
  email: string;
  role: 'Member' | 'Owner';
  message?: string;
}

/**
 * Invite Members Component
 * Handles inviting new members to a project through user search or email invitation
 * Features:
 * - Search and select existing users
 * - Invite by email
 * - Add custom invitation message
 * - Select member role (Member/Owner)
 * - Email preview
 * - Recipients list management
 */
@Component({
  selector: 'invite-members',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './invite-members.html',
  styleUrls: ['./invite-members.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class InviteMembers implements OnInit {
  // Form groups
  searchForm: FormGroup;
  inviteForm: FormGroup;

  // Signals for state management
  searchQuery = signal('');
  selectedRole = signal<'Member' | 'Owner'>('Member');
  recipientCount = signal(0);
  recipients = signal<InvitedRecipient[]>([]);
  searchResults = signal<User[]>([]);
  showSearchResults = signal(false);

  projectId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectsApi: ProjectsApi
  ) {
    // Initialize search form
    this.searchForm = this.formBuilder.group({
      search: ['']
    });

    // Initialize invite form
    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: [''],
      role: ['Member']
    });
  }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (!Number.isNaN(projectId)) {
      this.projectId = projectId;
    }
  }

  /**
   * Searches for users based on query
   */
  onSearchUsers(query: string): void {
    this.searchQuery.set(query);
    if (query.trim().length < 1) {
      this.searchResults.set([]);
      this.showSearchResults.set(false);
      return;
    }
    this.searchResults.set([]);
    this.showSearchResults.set(false);
  }

  /**
   * Adds a user from search results to recipients
   */
  onAddUserFromSearch(user: User): void {
    const recipient: InvitedRecipient = {
      id: user.id,
      email: user.email,
      role: this.selectedRole(),
      message: this.inviteForm.get('message')?.value || undefined
    };

    // Check if user already added
    const exists = this.recipients().some(r => r.email === user.email);
    if (!exists) {
      this.recipients.update(recipients => [...recipients, recipient]);
      this.recipientCount.update(count => count + 1);
      this.searchQuery.set('');
      this.searchResults.set([]);
      this.showSearchResults.set(false);
      console.log('User added to recipients:', user.email);
    } else {
      console.warn('User already added:', user.email);
    }
  }

  /**
   * Adds email recipient via manual entry
   */
  onAddEmailRecipient(email: string): void {
    if (!email.trim() || !this.isValidEmail(email)) {
      console.warn('Invalid email:', email);
      return;
    }

    // Check if email already added
    const exists = this.recipients().some(r => r.email === email);
    if (!exists) {
      const recipient: InvitedRecipient = {
        id: `email-${Date.now()}`,
        email: email.trim(),
        role: this.selectedRole(),
        message: this.inviteForm.get('message')?.value || undefined
      };

      this.recipients.update(recipients => [...recipients, recipient]);
      this.recipientCount.update(count => count + 1);
      this.inviteForm.get('email')?.reset();
      console.log('Email recipient added:', email);
    } else {
      console.warn('Email already added:', email);
    }
  }

  /**
   * Validates email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Removes a recipient from the list
   */
  onRemoveRecipient(recipientId: string): void {
    this.recipients.update(recipients =>
      recipients.filter(r => r.id !== recipientId)
    );
    this.recipientCount.update(count => Math.max(0, count - 1));
    console.log('Recipient removed:', recipientId);
  }

  /**
   * Updates the role for all recipients
   */
  onRoleChange(newRole: 'Member' | 'Owner'): void {
    this.selectedRole.set(newRole);
    // Update role for all current recipients
    this.recipients.update(recipients =>
      recipients.map(r => ({ ...r, role: newRole }))
    );
    console.log('Role changed to:', newRole);
  }

  /**
   * Updates the invitation message
   */
  onMessageChange(message: string): void {
    this.inviteForm.patchValue({ message });
  }

  /**
   * Sends all invitations
   */
  onSendInvites(): void {
    if (!this.projectId) {
      return;
    }
    const recipients = this.recipients();
    if (recipients.length === 0) {
      console.warn('No recipients to invite');
      return;
    }

    recipients.forEach(recipient => {
      this.projectsApi.inviteMember(this.projectId!, { email: recipient.email }).subscribe({
        next: () => {
          this.onRemoveRecipient(recipient.id);
        },
        error: () => {
          console.warn('Failed to invite', recipient.email);
        }
      });
    });
  }

  /**
   * Cancels the invite operation
   */
  onCancel(): void {
    this.resetForm();
    if (this.projectId) {
      this.router.navigate(['/app/projects', this.projectId, 'members']);
    }
  }

  /**
   * Resets all form fields and state
   */
  private resetForm(): void {
    this.recipients.set([]);
    this.recipientCount.set(0);
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showSearchResults.set(false);
    this.selectedRole.set('Member');
    this.searchForm.reset();
    this.inviteForm.reset({ role: 'Member' });
  }

  /**
   * Get role display text
   */
  getRoleDisplay(role: 'Member' | 'Owner'): string {
    return role === 'Owner' ? 'Owner' : 'Member';
  }

  /**
   * Check if email field is valid for submission
   */
  isEmailValid(): boolean {
    const emailControl = this.inviteForm.get('email');
    return emailControl ? emailControl.valid && emailControl.value.trim() !== '' : false;
  }

  /**
   * Get email input value
   */
  getEmailInput(): string {
    return this.inviteForm.get('email')?.value || '';
  }
}
