/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { ForgotPasswordStateService } from './forgot-password-state.service';

/**
 * ForgotYourPassword Component
 * 
 * Handles the password reset flow by allowing users to enter their email
 * and request a password reset link.
 */
@Component({
  selector: 'app-forgot-your-password',
  templateUrl: './forgot-your-password.component.html',
  styleUrls: ['./forgot-your-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ForgotYourPasswordComponent {
  /**
   * Form state for email input
   */
  email: string = '';

  /**
   * Track if form has been submitted
   */
  isSubmitted: boolean = false;

  /**
   * Track if reset link was sent successfully
   */
  resetLinkSent: boolean = false;

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (!this.email.trim()) {
      return;
    }

    const email = this.email.trim();
    this.authApi.requestPasswordReset(email).subscribe({
      next: () => this.handleResetRequested(email),
      error: () => this.handleResetRequested(email)
    });
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }

  isEmailValid(): boolean {
    return this.emailRegex.test(this.email.trim());
  }

  private handleResetRequested(email: string): void {
    this.resetLinkSent = true;
    this.forgotPasswordState.setEmail(email);
    this.router.navigate(['/check-your-email']);
  }
}
