/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

/**
 * NoIssuesYetView Component
 * 
 * Displays an empty state view when there are no issues yet.
 * Prompts users to create their first issue and provides a getting started guide link.
 * Supports both creating new issues and navigating to documentation.
 */
@Component({
  selector: 'app-no-issues-yet-view',
  templateUrl: './no-issues-yet-view.component.html',
  styleUrls: ['./no-issues-yet-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class NoIssuesYetViewComponent {
  /**
   * Event emitted when user clicks "Create Your First Issue" button
   */
  @Output() createIssueClick = new EventEmitter<void>();

  /**
   * Handles the create issue button click
   */
  onCreateIssueClick(): void {
    this.createIssueClick.emit();
  }

  /**
   * Navigate to getting started guide
   */
  onViewGettingStartedGuide(): void {
    // TODO: Replace with actual navigation logic
    window.open('https://docs.example.com/getting-started', '_blank');
  }
}
