import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-issue-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-row.html',
  styleUrls: ['./issue-row.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueRowComponent {
  // Issue data
  issueId = input<string>('');
  issueTitle = input<string>('');
  category = input<string>('');
  type = input<string>('');
  statusLabel = input<string>('');
  priorityLabel = input<string>('');
  assigneeAvatar = input<string>('');
  assigneeName = input<string>('');
  updatedTime = input<string>('');

  relativeTime = computed(() => {
    const raw = this.updatedTime();
    if (!raw) return '';
    const now = Date.now();
    const then = new Date(raw).getTime();
    if (isNaN(then)) return raw;
    const diffMs = now - then;
    if (diffMs < 0) return 'Just now';
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  });

  // Style overrides
  borderBottom = input<string | undefined>('');
  padding = input<string | undefined>('');
  titleFlex = input<string | number | undefined>('');
  categoryPadding = input<string | undefined>('');
  categoryColor = input<string | undefined>('');
  categoryFlex = input<string | number | undefined>('');
  categoryDisplay = input<string | undefined>('');
  typeWidth = input<string | undefined>('');
  typeColor = input<string | undefined>('');
  typeDisplay = input<string | undefined>('');
  typeFlex = input<string | number | undefined>('');
  statusBgColor = input<string | undefined>('');
  statusPadding = input<string | undefined>('');
  statusColor = input<string | undefined>('');
  priorityBgColor = input<string | undefined>('');
  priorityPadding = input<string | undefined>('');
  priorityColor = input<string | undefined>('');
  assigneeOverflow = input<string | undefined>('');
  assigneeColor = input<string | undefined>('');
  timelineFlex = input<string | number | undefined>('');
}
