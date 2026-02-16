import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { ForgotPasswordStateService } from './forgot-password-state.service';

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
  imports: [FormsModule]
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

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private forgotPasswordState: ForgotPasswordStateService
  ) {}

  /**
   * Handle password reset request submission
   * Validates input and triggers password reset email
   */
  onSubmitResetRequest(): void {
    this.isSubmitted = true;

    if (!this.emailOrUsername.trim()) {
      return;
    }

    const email = this.emailOrUsername.trim();
    this.authApi.requestPasswordReset(email).subscribe({
      next: () => {
        this.resetLinkSent = true;
        this.forgotPasswordState.setEmail(email);
        this.router.navigate(['/check-your-email']);
      },
      error: () => {
        this.resetLinkSent = true;
        this.forgotPasswordState.setEmail(email);
        this.router.navigate(['/check-your-email']);
      }
    });
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }
}
