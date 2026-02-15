import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FrameComponent } from '../frame-component/frame-component';

@Component({
  selector: 'app-side-menu-expanded',
  standalone: true,
  imports: [FrameComponent],
  templateUrl: './side-menu-expanded.html',
  styleUrls: ['./side-menu-expanded.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class SideMenuExpandedComponent {}
