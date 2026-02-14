import { Component, input, ChangeDetectionStrategy } from '@angular/core';
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
