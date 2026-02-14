import { Component, ChangeDetectionStrategy, signal, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectsApi } from '../../features/projects/data/projects.api';
import { ProjectDto } from '../../models/api.models';

/**
 * CreateNewProjectModal Component
 * Displays a modal dialog for creating a new project with form fields for:
 * - Project name (required)
 * - Description (optional, max 500 characters)
 * - Visibility setting (Private/Public)
 * - Project owner
 * - Member invitations
 * - Advanced settings option
 */
@Component({
  selector: 'app-create-new-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-new-project-modal.component.html',
  styleUrls: ['./create-new-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class CreateNewProjectModalComponent implements OnInit {
  // Form state
  projectForm: FormGroup;

  // Description character counter
  descriptionCharCount = signal(0);
  descriptionMaxChars = 500;

  isSubmitting = signal(false);
  errorMessage = signal('');

  // Selected members for invitation
  selectedMembers = signal<string[]>([]);

  // Available members to invite
  availableMembers = signal([
    { id: '1', name: 'Sarah Wilson', avatar: '/assets/images/img@2x.png' },
    { id: '2', name: 'Mike Johnson', avatar: '/assets/images/img@2x.png' }
  ]);

  // Search filter for members
  memberSearchTerm = signal('');

  // Current user (project owner)
  currentUser = {
    name: 'John Smith (You)',
    avatar: '/assets/images/img@2x.png'
  };

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<ProjectDto>();

  constructor(private fb: FormBuilder, private readonly projectsApi: ProjectsApi) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      visibility: ['private'], // 'private' or 'public'
      advancedSettings: [false]
    });
  }

  ngOnInit(): void {
    // Watch description input for character count
    this.projectForm.get('description')?.valueChanges.subscribe((value: string) => {
      this.descriptionCharCount.set(value?.length || 0);
    });
  }

  /**
   * Get filtered members based on search term
   */
  get filteredMembers() {
    const searchTerm = this.memberSearchTerm().toLowerCase();
    return this.availableMembers().filter(member =>
      member.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Toggle member selection
   */
  toggleMemberSelection(memberId: string): void {
    const selected = this.selectedMembers();
    const index = selected.indexOf(memberId);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(memberId);
    }
    this.selectedMembers.set([...selected]);
  }

  /**
   * Check if member is selected
   */
  isMemberSelected(memberId: string): boolean {
    return this.selectedMembers().includes(memberId);
  }

  /**
   * Get selected member names
   */
  getSelectedMemberNames(): string[] {
    return this.selectedMembers().map(id => {
      const member = this.availableMembers().find(m => m.id === id);
      return member?.name || '';
    }).filter(name => name);
  }

  /**
   * Handle form submission
   */
  onCreateProject(): void {
    if (!this.projectForm.valid || this.isSubmitting()) {
      return;
    }

    const projectName = (this.projectForm.get('projectName')?.value || '').trim();
    if (!projectName) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.projectsApi.createProject({ name: projectName }).subscribe({
      next: (project) => {
        this.isSubmitting.set(false);
        this.created.emit(project);
        this.onCancel();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Unable to create project. Please try again.');
      }
    });
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.projectForm.reset();
    this.selectedMembers.set([]);
    this.memberSearchTerm.set('');
    this.errorMessage.set('');
    this.isSubmitting.set(false);
    this.closed.emit();
  }

  /**
   * Handle advanced settings click
   */
  onAdvancedSettings(): void {
    // TODO: Navigate to advanced settings or open submenu
    console.log('Advanced settings clicked');
  }
}
