import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core'

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
  @Output() viewChanged = new EventEmitter<ViewType>()

  /**
   * Handle view type change
   */
  onViewChange(view: ViewType): void {
    this.viewChanged.emit(view)
  }
}
