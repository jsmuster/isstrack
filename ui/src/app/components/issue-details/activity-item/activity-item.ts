/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Activity Item Component
 * Displays a single activity log item in the issue's activity timeline
 * 
 * Props:
 * - div: Avatar image path (legacy)
 * - hoursAgo: Relative timestamp (e.g., "2 hours ago")
 * - actorLabel: Display name for the activity actor
 * - message: Activity message
 * - sarahJohnsonAddedContainerColor: CSS color value for text styling (legacy)
 * - activityType: Type of activity ('comment' | 'priority' | 'assignment' | 'status' | 'tag' | 'created')
 */
@Component({
  selector: 'activity-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-item.html',
  styleUrls: ['./activity-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItem {
  // Input props
  div = input<string>('');
  hoursAgo = input<string>('');
  actorLabel = input<string>('');
  message = input<string>('');
  sarahJohnsonAddedContainerColor = input<string | number | undefined>('');
  activityType = input<string>('comment');

  getIconSymbol(): string {
    const symbols: Record<string, string> = {
      'comment': '💬',
      'priority': '⚑',
      'assignment': '👤',
      'status': '⟳',
      'tag': '#',
      'created': '+',
    };
    return symbols[this.activityType()] || '•';
  }
}
