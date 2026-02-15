import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * SideMenuCollapsedComponent
 * 
 * Displays a compact vertical navigation menu with icon buttons.
 * Used when the sidebar is in collapsed state to save screen space.
 * Features icon navigation items and recent project badges.
 */
@Component({
  selector: 'app-side-menu-collapsed',
  standalone: true,
  imports: [],
  templateUrl: './side-menu-collapsed.html',
  styleUrls: ['./side-menu-collapsed.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class SideMenuCollapsedComponent {}
