import { CommonModule } from '@angular/common'
import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, signal } from '@angular/core'
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { IssuesApi } from '../../features/issues/data/issues.api'
import { IssueDto } from '../../models/api.models'

interface KanbanColumn {
  status: string
  issues: IssueDto[]
}

interface AssigneeOption {
  value: string
  label: string
}

/**
 * KanbanBoardComponent
 * Displays issues in a kanban board with columns for different statuses
 * Supports 5 columns: Open, In Progress, Review, Resolved, Closed
 */
@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class KanbanBoardComponent {
  @Input() projectId: number | null = null
  @Input() paginationLabel = ''
  @Input() currentPage = 1
  @Input() hasPrevPage = false
  @Input() hasNextPage = false
  @Input() set issues(value: IssueDto[]) {
    this.issuesSource = value ?? []
    this.rebuildColumns()
  }
  @Input() set assignees(value: AssigneeOption[]) {
    this.assigneeOptions = value ?? []
    const pairs: Array<[number, string]> = []
    for (const option of this.assigneeOptions) {
      const id = Number(option.value)
      if (!Number.isNaN(id)) {
        pairs.push([id, option.label])
      }
    }
    this.assigneeLookup = new Map(pairs)
  }

  @Output() issueSelected = new EventEmitter<number>()
  @Output() issueUpdated = new EventEmitter<IssueDto>()
  @Output() createIssueRequested = new EventEmitter<string>()
  @Output() previousPage = new EventEmitter<void>()
  @Output() nextPage = new EventEmitter<void>()

  columns = signal<KanbanColumn[]>([])
  columnIds = signal<string[]>([])
  errorMessage = signal('')

  private readonly defaultStatuses = ['Open', 'In Progress', 'Review', 'Resolved', 'Closed']
  private issuesSource: IssueDto[] = []
  private assigneeOptions: AssigneeOption[] = []
  private assigneeLookup = new Map<number, string>()

  constructor(private readonly issuesApi: IssuesApi) {}

  /**
   * Handle adding a new issue to a column
   */
  onAddIssue(columnStatus: string): void {
    this.createIssueRequested.emit(columnStatus)
  }

  /**
   * Handle pagination - previous page
   */
  onPreviousPage(): void {
    if (this.hasPrevPage) {
      this.previousPage.emit()
    }
  }

  /**
   * Handle pagination - next page
   */
  onNextPage(): void {
    if (this.hasNextPage) {
      this.nextPage.emit()
    }
  }

  /**
   * Handle page number click
   */
  onPageClick(pageNumber: number): void {
    if (pageNumber !== this.currentPage) {
      this.nextPage.emit()
    }
  }

  onCardDrop(event: CdkDragDrop<IssueDto[]>, column: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(column.issues, event.previousIndex, event.currentIndex)
      this.columns.set([...this.columns()])
      return
    }
    const previousColumn = this.columns().find(item => item.issues === event.previousContainer.data)
    if (!previousColumn) {
      return
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )
    const movedIssue = event.container.data[event.currentIndex]
    this.updateIssueStatus(movedIssue, column.status, previousColumn.status)
  }

  onIssueClick(issue: IssueDto): void {
    this.issueSelected.emit(issue.id)
  }

  formatTimestamp(dateValue: string): string {
    if (!dateValue) {
      return ''
    }
    const date = new Date(dateValue)
    return Number.isNaN(date.getTime()) ? dateValue : date.toLocaleDateString()
  }

  getTagClass(tag: string): string {
    const normalized = tag.toLowerCase()
    if (normalized === 'frontend') return 'tag-frontend'
    if (normalized === 'backend') return 'tag-backend'
    if (normalized === 'bug') return 'tag-bug'
    if (normalized === 'feature') return 'tag-feature'
    if (normalized === 'performance') return 'tag-performance'
    if (normalized === 'responsive') return 'tag-responsive'
    return 'tag-default'
  }

  getPriorityClass(priority: string): string {
    const normalized = priority.toLowerCase()
    if (normalized === 'high' || normalized === 'critical') return 'priority-high'
    if (normalized === 'medium') return 'priority-medium'
    return 'priority-low'
  }

  toAssigneeLabel(assigneeUserId: number | null): string {
    if (!assigneeUserId) {
      return 'Unassigned'
    }
    return this.assigneeLookup.get(assigneeUserId) ?? `User ${assigneeUserId}`
  }

  private rebuildColumns(): void {
    const statuses = this.collectStatuses()
    const columns = statuses.map(status => ({
      status,
      issues: this.issuesSource.filter(issue => this.normalizeStatus(issue.status) === this.normalizeStatus(status))
    }))
    this.columns.set(columns)
    this.columnIds.set(columns.map(column => this.slugifyStatus(column.status)))
  }

  private collectStatuses(): string[] {
    const statuses = [...this.defaultStatuses]
    const known = new Set(statuses.map(status => this.normalizeStatus(status)))
    for (const issue of this.issuesSource) {
      const normalized = this.normalizeStatus(issue.status)
      if (!known.has(normalized)) {
        known.add(normalized)
        statuses.push(issue.status)
      }
    }
    return statuses
  }

  private normalizeStatus(status: string): string {
    return (status || '').trim().toLowerCase()
  }

  private slugifyStatus(status: string): string {
    return this.normalizeStatus(status).replace(/\s+/g, '-') || 'status'
  }

  private updateIssueStatus(issue: IssueDto, nextStatus: string, previousStatus: string): void {
    const updatedIssue = { ...issue, status: nextStatus }
    this.replaceIssue(updatedIssue)
    this.errorMessage.set('')
    this.issuesApi.patchIssue(issue.id, { status: nextStatus }).subscribe({
      next: (response) => {
        this.replaceIssue(response)
        this.issueUpdated.emit(response)
      },
      error: () => {
        this.errorMessage.set('Unable to update issue status.')
        this.moveIssueToStatus(issue, previousStatus)
      }
    })
  }

  private replaceIssue(updated: IssueDto): void {
    const columns = this.columns()
    let didUpdate = false
    for (const column of columns) {
      const index = column.issues.findIndex(item => item.id === updated.id)
      if (index >= 0) {
        column.issues[index] = updated
        didUpdate = true
      }
    }
    if (!didUpdate) {
      const targetStatus = this.normalizeStatus(updated.status)
      const targetColumn = columns.find(column => this.normalizeStatus(column.status) === targetStatus)
      if (targetColumn) {
        targetColumn.issues.unshift(updated)
      }
    }
    this.columns.set([...columns])
  }

  private moveIssueToStatus(issue: IssueDto, status: string): void {
    const columns = this.columns()
    for (const column of columns) {
      column.issues = column.issues.filter(item => item.id !== issue.id)
    }
    const target = columns.find(column => this.normalizeStatus(column.status) === this.normalizeStatus(status))
    if (target) {
      target.issues.unshift({ ...issue, status })
    }
    this.columns.set([...columns])
  }
}
