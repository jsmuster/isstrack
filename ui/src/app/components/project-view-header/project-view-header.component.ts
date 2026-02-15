import { Component, ChangeDetectionStrategy } from '@angular/core'

/**
 * ProjectViewHeaderComponent
 * Displays project information and navigation
 * Contains project title, description, and icons for quick actions
 */
@Component({
  selector: 'app-project-view-header',
  imports: [],
  templateUrl: './project-view-header.component.html',
  styleUrls: ['./project-view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class ProjectViewHeaderComponent {
  // Project information will be bound from parent component
}
