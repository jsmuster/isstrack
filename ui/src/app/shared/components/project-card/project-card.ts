import { Component, input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  // Project information
  projectIcon = input<string>('');
  projectName = input<string>('');
  projectRole = input<string>('');
  ownerEmail = input<string>('');
  createdDate = input<string>('');
  projectDescription = input<string>('');
  
  // Status badges
  openIssuesIcon = input<string>('');
  openIssuesCount = input<string>('');
  statusIcon = input<string>('');
  statusLabel = input<string>('');
  
  // Style overrides
  roleBgColor = input<string | undefined>('');
  rolePadding = input<string | undefined>('');
  roleColor = input<string | undefined>('');
  issuesGap = input<string | undefined>('');
  issuesMinWidth = input<string | undefined>('');
  issuesBgColor = input<string | undefined>('');
  issuesPadding = input<string | undefined>('');
  issuesTextColor = input<string | undefined>('');
  statusColor = input<string | undefined>('');

  @Output() openProject = new EventEmitter<void>();

  onOpenProject() {
    this.openProject.emit();
  }
}
