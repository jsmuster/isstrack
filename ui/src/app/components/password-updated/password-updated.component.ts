/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * PasswordUpdated Component
 *
 * Confirmation page displayed after successful password reset.
 * Provides navigation to sign in with new password or reset another password.
 */
@Component({
  selector: 'app-password-updated',
  templateUrl: './password-updated.component.html',
  styleUrls: ['./password-updated.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class PasswordUpdatedComponent {
  constructor(private router: Router) {}

  /**
   * Navigate to sign in page
   * User can now log in with their new password
   */
  goToSignIn(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to forgot password page to reset another password
   */
  resetAnotherPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
