/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core'

export type ViewType = 'table' | 'kanban'

/**
 * ProjectViewSubtabsComponent
 * Displays view switcher between Table and Kanban views
 * Also shows issue count for the current project
 */
@Component({
  selector: 'app-project-view-subtabs',
  imports: [],
  templateUrl: './project-view-subtabs.component.html',
  styleUrls: ['./project-view-subtabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectViewSubtabsComponent {
  @Input() activeView: ViewType = 'table'
  @Input() issueCount = 0
  @Output() viewChanged = new EventEmitter<ViewType>()

  /**
   * Handle view type change
   */
  onViewChange(view: ViewType): void {
    this.viewChanged.emit(view)
  }
}
