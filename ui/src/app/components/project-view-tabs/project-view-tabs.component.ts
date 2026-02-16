/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core'

export type TabType = 'issues' | 'members' | 'settings'

/**
 * ProjectViewTabsComponent
 * Displays navigation tabs for project sections: Issues, Members, Settings
 * Allows switching between different project views
 */
@Component({
  selector: 'app-project-view-tabs',
  imports: [],
  templateUrl: './project-view-tabs.component.html',
  styleUrls: ['./project-view-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectViewTabsComponent {
  @Output() tabChanged = new EventEmitter<TabType>()

  /**
   * Handle tab selection
   */
  onTabClick(tab: TabType): void {
    this.tabChanged.emit(tab)
  }
}
