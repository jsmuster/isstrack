import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

/**
 * ResetLinkExpired Component
 *
 * Displayed when user attempts to use an expired password reset link.
 * Provides options to request a new reset link or navigate to support.
 */
@Component({
  selector: 'app-reset-link-expired',
  templateUrl: './reset-link-expired.component.html',
  styleUrls: ['./reset-link-expired.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: []
})
export class ResetLinkExpiredComponent {
  constructor(private router: Router) {}

  /**
   * Request a new password reset link
   * Redirects to forgot password page to start the process again
   */
  requestNewLink(): void {
    // TODO: Call backend service to initiate new password reset
    // this.authService.requestPasswordReset().subscribe(...)
    
    this.router.navigate(['/forgot-password']);
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to contact support page
   */
  contactSupport(): void {
    // TODO: Navigate to support page or open support modal
    // this.router.navigate(['/support']);
  }
}
