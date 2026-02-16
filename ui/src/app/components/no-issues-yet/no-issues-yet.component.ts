/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NoIssuesYet Component
 * 
 * Displays an empty state screen when there are no issues in a project.
 * This component appears in the main center area after entering a project.
 * 
 * Features:
 * - Responsive empty state layout
 * - Call-to-action button for creating first issue (emits event)
 * - Helpful getting started link
 * 
 * Events:
 * - createIssueRequested: Emitted when "Create Your First Issue" button is clicked
 * - viewGettingStartedRequested: Emitted when "View our getting started guide" link is clicked
 */
@Component({
  selector: 'app-no-issues-yet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-issues-yet.component.html',
  styleUrls: ['./no-issues-yet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoIssuesYetComponent {
  /**
   * Emitted when the "Create Your First Issue" button is clicked
   */
  @Output() createIssueRequested = new EventEmitter<void>();

  /**
   * Emitted when the "View our getting started guide" link is clicked
   */
  @Output() viewGettingStartedRequested = new EventEmitter<void>();

  /**
   * Handles the "Create Your First Issue" button click
   * Emits the createIssueRequested event
   */
  onCreateFirstIssue(): void {
    this.createIssueRequested.emit();
  }

  /**
   * Handles the "View our getting started guide" link click
   * Emits the viewGettingStartedRequested event
   */
  onViewGettingStarted(): void {
    this.viewGettingStartedRequested.emit();
  }
}
