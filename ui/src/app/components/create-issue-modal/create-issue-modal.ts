import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Issue interface for new issue creation
 */
interface IssueForm {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  tags: string[];
}

/**
 * Priority option interface
 */
interface PriorityOption {
  value: 'Low' | 'Medium' | 'High' | 'Critical';
  label: string;
  color: string;
}

/**
 * Assignee option interface
 */
interface AssigneeOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Create Issue Modal Component
 * Provides a dialog form for creating new issues with:
 * - Title (required)
 * - Description
 * - Priority level selection
 * - Assignee selection
 * - Tag management
 */
@Component({
  selector: 'create-issue-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-issue-modal.html',
  styleUrls: ['./create-issue-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class CreateIssueModal implements OnInit {
  // Form group
  issueForm: FormGroup;

  // State signals
  tags = signal<string[]>([]);
  currentTagInput = signal('');
  selectedPriority = signal<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  selectedAssignee = signal('');
  isSubmitting = signal(false);

  // Priority options
  priorityOptions: PriorityOption[] = [
    { value: 'Low', label: 'Low', color: '#10b981' },
    { value: 'Medium', label: 'Medium', color: '#f59e0b' },
    { value: 'High', label: 'High', color: '#ef4444' },
    { value: 'Critical', label: 'Critical', color: '#7c3aed' }
  ];

  // Assignee options
  assigneeOptions: AssigneeOption[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com' },
    { id: '2', name: 'Mike Chen', email: 'mike@company.com' },
    { id: '3', name: 'Alex Rodriguez', email: 'alex@company.com' },
    { id: '4', name: 'Emma Thompson', email: 'emma@company.com' }
  ];

  constructor(private formBuilder: FormBuilder) {
    // Initialize form with validation
    this.issueForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['Medium'],
      assignee: [''],
      tags: [[]]
    });
  }

  ngOnInit(): void {
    // Form initialization
  }

  /**
   * Handles priority selection change
   */
  onPriorityChange(priority: string): void {
    this.selectedPriority.set(priority as 'Low' | 'Medium' | 'High' | 'Critical');
    this.issueForm.patchValue({ priority });
    console.log('Priority changed to:', priority);
  }

  /**
   * Handles assignee selection change
   */
  onAssigneeChange(assigneeId: string): void {
    this.selectedAssignee.set(assigneeId);
    this.issueForm.patchValue({ assignee: assigneeId });
    console.log('Assignee changed to:', assigneeId);
  }

  /**
   * Adds a tag on Enter key press
   */
  onTagInput(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  /**
   * Adds a new tag to the list
   */
  addTag(): void {
    const tagInput = this.currentTagInput().trim();

    if (tagInput.length === 0) {
      console.warn('Tag input is empty');
      return;
    }

    const currentTags = this.tags();
    if (currentTags.includes(tagInput)) {
      console.warn('Tag already exists:', tagInput);
      return;
    }

    this.tags.update(tags => [...tags, tagInput]);
    this.issueForm.patchValue({ tags: this.tags() });
    this.currentTagInput.set('');
    console.log('Tag added:', tagInput);
  }

  /**
   * Removes a tag from the list
   */
  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
    this.issueForm.patchValue({ tags: this.tags() });
    console.log('Tag removed:', tag);
  }

  /**
   * Gets the selected assignee display name
   */
  getAssigneeDisplayName(): string {
    const assigneeId = this.selectedAssignee();
    if (!assigneeId) return 'Select assignee...';
    const assignee = this.assigneeOptions.find(a => a.id === assigneeId);
    return assignee ? assignee.name : 'Select assignee...';
  }

  /**
   * Submits the issue creation form
   */
  onCreateIssue(): void {
    if (!this.issueForm.valid) {
      console.warn('Form is invalid');
      Object.keys(this.issueForm.controls).forEach(key => {
        const control = this.issueForm.get(key);
        if (control && control.invalid) {
          console.warn(`Field ${key} is invalid`);
        }
      });
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.issueForm.value;
    console.log('Creating issue with data:', formData);

    // Simulate API call
    setTimeout(() => {
      console.log('Issue created successfully');
      this.onCancel();
      this.isSubmitting.set(false);
    }, 1000);
  }

  /**
   * Cancels the modal and resets form
   */
  onCancel(): void {
    this.resetForm();
    console.log('Modal cancelled');
  }

  /**
   * Resets the entire form to initial state
   */
  private resetForm(): void {
    this.issueForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: '',
      tags: []
    });
    this.tags.set([]);
    this.currentTagInput.set('');
    this.selectedPriority.set('Medium');
    this.selectedAssignee.set('');
  }

  /**
   * Gets priority color class
   */
  getPriorityColor(priority: string): string {
    const option = this.priorityOptions.find(p => p.value === priority);
    return option ? option.color : '#6b7280';
  }

  /**
   * Checks if form is valid for submission
   */
  isFormValid(): boolean {
    return this.issueForm.valid;
  }

  /**
   * Gets title input error message
   */
  getTitleErrorMessage(): string {
    const control = this.issueForm.get('title');
    if (control?.hasError('required')) {
      return 'Issue title is required';
    }
    if (control?.hasError('minlength')) {
      return 'Issue title must be at least 3 characters';
    }
    return '';
  }
}
