import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

/**
 * ForgotYourPassword Component
 * 
 * Handles the password reset flow by allowing users to enter their email or username
 * and request a password reset link.
 */
@Component({
  selector: 'app-forgot-your-password',
  templateUrl: './forgot-your-password.component.html',
  styleUrls: ['./forgot-your-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: []
})
export class ForgotYourPasswordComponent {
  /**
   * Form state for email/username input
   */
  emailOrUsername: string = '';

  /**
   * Track if form has been submitted
   */
  isSubmitted: boolean = false;

  /**
   * Track if reset link was sent successfully
   */
  resetLinkSent: boolean = false;

  constructor(private router: Router) {}

  /**
   * Handle password reset request submission
   * Validates input and triggers password reset email
   */
  onSubmitResetRequest(): void {
    this.isSubmitted = true;

    if (!this.emailOrUsername.trim()) {
      return;
    }

    // TODO: Call backend service to send reset email
    // this.authService.requestPasswordReset(this.emailOrUsername).subscribe(...)
    
    this.resetLinkSent = true;
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }
}
