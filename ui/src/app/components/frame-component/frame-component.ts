/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-frame-component',
  standalone: true,
  imports: [],
  templateUrl: './frame-component.html',
  styleUrls: ['./frame-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class FrameComponent {}
