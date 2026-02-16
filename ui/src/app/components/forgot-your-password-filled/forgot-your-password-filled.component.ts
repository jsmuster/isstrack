import { Component, ChangeDetectionStrategy, FormsModule } from '@angular/core';
import { Router } from '@angular/router';

/**
 * ForgotYourPasswordFilled Component
 *
 * Filled variant showing the password reset form with a pre-filled email/username example.
 * Demonstrates the state when user has entered their credentials.
 */
@Component({
  selector: 'app-forgot-your-password-filled',
  templateUrl: './forgot-your-password-filled.component.html',
  styleUrls: ['./forgot-your-password-filled.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule]
})
export class ForgotYourPasswordFilledComponent {
  /**
   * Form state for email/username input
   */
  emailOrUsername: string = 'deanna.curtis@example.com';

  /**
   * Track if form has been submitted
   */
  isSubmitted: boolean = false;

  /**
   * Track if reset link was sent successfully
   */
  resetLinkSent: boolean = false;

  /**
   * Error message for form validation
   */
  errorMessage: string = '';

  constructor(private router: Router) {}

  /**
   * Handle password reset request submission
   * Validates input and triggers password reset email
   */
  onSubmitResetRequest(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (!this.emailOrUsername.trim()) {
      this.errorMessage = 'Please enter your email or username';
      return;
    }

    // Validate email format if input contains @
    if (
      this.emailOrUsername.includes('@') &&
      !this.isValidEmail(this.emailOrUsername)
    ) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // TODO: Call backend service to send reset email
    // this.authService.requestPasswordReset(this.emailOrUsername).subscribe(
    //   (response) => {
    //     this.resetLinkSent = true;
    //   },
    //   (error) => {
    //     this.errorMessage = 'Failed to send reset link. Please try again.';
    //   }
    // );

    this.resetLinkSent = true;
  }

  /**
   * Validate email format using regex
   * @param email Email address to validate
   * @returns true if email is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }
}
