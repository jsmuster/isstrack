import { Component, signal, computed, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { ProjectsApi } from '../../features/projects/data/projects.api'
import { IssueDto, MembershipDto, ProjectDto } from '../../models/api.models'
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown'
import { QuillModule, QuillEditorComponent } from 'ngx-quill'

/**
 * Priority option interface
 */
interface PriorityOption {
  value: 'Low' | 'Medium' | 'High' | 'Critical'
  label: string
  color: string
}

/**
 * Assignee option interface
 */
interface AssigneeOption {
  id: string
  name: string
  email: string
  avatar?: string
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
  imports: [CommonModule, ReactiveFormsModule, QuillModule, DropdownComponent],
  templateUrl: './create-issue-modal.html',
  styleUrls: ['./create-issue-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateIssueModal implements OnInit, AfterViewInit {
  // Form group
  issueForm: FormGroup

  // State signals
  tags = signal<string[]>([])
  currentTagInput = signal('')
  selectedPriority = signal<'Low' | 'Medium' | 'High' | 'Critical'>('Medium')
  selectedAssignee = signal('')
  isSubmitting = signal(false)
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'code-block', 'clean']
    ]
  }

  // Priority options
  priorityOptions: PriorityOption[] = [
    { value: 'Low', label: 'Low', color: '#10b981' },
    { value: 'Medium', label: 'Medium', color: '#f59e0b' },
    { value: 'High', label: 'High', color: '#ef4444' },
    { value: 'Critical', label: 'Critical', color: '#7c3aed' }
  ]

  priorityDropdownOptions: DropdownOption[] = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ]

  // Assignee options
  assigneeOptions = signal<AssigneeOption[]>([])

  assigneeDropdownOptions = computed(() => {
    const options: DropdownOption[] = [{ value: '', label: 'Select assignee...' }]
    for (const a of this.assigneeOptions()) {
      options.push({ value: a.id, label: a.name })
    }
    return options
  })
  errorMessage = signal('')
  project = signal<ProjectDto | null>(null)
  nextIssueNumber = signal<number | null>(null)
  nextIssueKey = computed(() => {
    const proj = this.project()
    const num = this.nextIssueNumber()
    if (!proj?.prefix || num === null) return null
    return `${proj.prefix}-${String(num).padStart(3, '0')}`
  })

  @Input() projectId: number | null = null
  @Output() closed = new EventEmitter<void>()
  @Output() created = new EventEmitter<IssueDto>()
  @ViewChild('issueTitleInput') issueTitleInput?: ElementRef<HTMLInputElement>
  @ViewChild('descriptionEditor') descriptionEditor?: QuillEditorComponent

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly issuesApi: IssuesApi,
    private readonly projectsApi: ProjectsApi
  ) {
    // Initialize form with validation
    this.issueForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['Medium'],
      assignee: [''],
      tags: [[]]
    })
  }

  ngOnInit(): void {
    if (!this.projectId) {
      const projectId = Number(this.route.snapshot.paramMap.get('projectId'))
      if (!Number.isNaN(projectId)) {
        this.projectId = projectId
      }
    }
    if (this.projectId) {
      this.loadAssignees(this.projectId)
      this.loadProject(this.projectId)
      this.loadNextIssueNumber(this.projectId)
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.issueTitleInput?.nativeElement.focus(), 0)
  }

  onTitleTab(event: Event): void {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.shiftKey) {
      return
    }
    keyboardEvent.preventDefault()
    setTimeout(() => this.descriptionEditor?.quillEditor?.focus(), 0)
  }

  /**
   * Handles priority selection change
   */
  onPriorityChange(priority: string): void {
    this.selectedPriority.set(priority as 'Low' | 'Medium' | 'High' | 'Critical')
    this.issueForm.patchValue({ priority })
  }

  /**
   * Handles assignee selection change
   */
  onAssigneeChange(assigneeId: string): void {
    this.selectedAssignee.set(assigneeId)
    this.issueForm.patchValue({ assignee: assigneeId })
  }

  /**
   * Adds a tag on Enter key press
   */
  onTagInput(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.addTag()
    }
  }

  /**
   * Adds a new tag to the list
   */
  addTag(): void {
    const tagInput = this.currentTagInput().trim()

    if (tagInput.length === 0) {
      return
    }

    const currentTags = this.tags()
    if (currentTags.includes(tagInput)) {
      return
    }

    this.tags.update(tags => [...tags, tagInput])
    this.issueForm.patchValue({ tags: this.tags() })
    this.currentTagInput.set('')
  }

  /**
   * Removes a tag from the list
   */
  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag))
    this.issueForm.patchValue({ tags: this.tags() })
  }

  /**
   * Gets the selected assignee display name
   */
  getAssigneeDisplayName(): string {
    const assigneeId = this.selectedAssignee()
    if (!assigneeId) return 'Select assignee...'
    const assignee = this.assigneeOptions().find(a => a.id === assigneeId)
    return assignee ? assignee.name : 'Select assignee...'
  }

  /**
   * Submits the issue creation form
   */
  onCreateIssue(): void {
    if (!this.issueForm.valid || !this.projectId) {
      return
    }

    const assigneeValue = this.issueForm.get('assignee')?.value || ''
    const assigneeUserId = assigneeValue ? Number(assigneeValue) : null

    this.isSubmitting.set(true)
    this.errorMessage.set('')
    this.issuesApi.createIssue(this.projectId, {
      title: this.issueForm.get('title')?.value,
      description: this.issueForm.get('description')?.value || null,
      priority: this.issueForm.get('priority')?.value,
      assigneeUserId: Number.isNaN(assigneeUserId) ? null : assigneeUserId,
      tags: this.tags().length > 0 ? this.tags() : null
    }).subscribe({
      next: (issue) => {
        this.isSubmitting.set(false)
        this.created.emit(issue)
        this.onCancel()
      },
      error: () => {
        this.errorMessage.set('Unable to create issue. Please try again.')
        this.isSubmitting.set(false)
      }
    })
  }

  /**
   * Cancels the modal and resets form
   */
  onCancel(): void {
    this.resetForm()
    this.closed.emit()
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
    })
    this.tags.set([])
    this.currentTagInput.set('')
    this.selectedPriority.set('Medium')
    this.selectedAssignee.set('')
  }

  /**
   * Gets priority color class
   */
  /**
   * Checks if form is valid for submission
   */
  isFormValid(): boolean {
    return this.issueForm.valid
  }

  /**
   * Gets title input error message
   */
  getTitleErrorMessage(): string {
    const control = this.issueForm.get('title')
    if (control?.hasError('required')) {
      return 'Issue title is required'
    }
    if (control?.hasError('minlength')) {
      return 'Issue title must be at least 3 characters'
    }
    return ''
  }

  private loadProject(projectId: number): void {
    this.projectsApi.getProject(projectId).subscribe({
      next: (proj) => this.project.set(proj),
      error: () => {}
    })
  }

  private loadNextIssueNumber(projectId: number): void {
    this.issuesApi.listIssues(projectId, { size: 1 }).subscribe({
      next: (page) => this.nextIssueNumber.set(page.totalElements + 1),
      error: () => {}
    })
  }

  private loadAssignees(projectId: number): void {
    this.projectsApi.listMembers(projectId, 0, 50).subscribe({
      next: (page) => {
        const options = page.items
          .filter(member => member.status === 'ACTIVE')
          .filter(member => member.userId !== null)
          .map(member => ({
            id: String(member.userId),
            name: this.mapMemberLabel(member),
            email: member.invitedEmail || ''
          }))
        this.assigneeOptions.set(options)
      },
      error: () => {
        this.assigneeOptions.set([])
      }
    })
  }

  private mapMemberLabel(member: MembershipDto): string {
    // Show email or user ID if available
    if (member.invitedEmail) {
      return member.invitedEmail
    }
    return member.userId ? `User ${member.userId}` : 'Member'
  }
}
