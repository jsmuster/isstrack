/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { ForgotPasswordStateService } from '../forgot-your-password/forgot-password-state.service';
import { findProviderLoginUrl } from './email-provider.util';

/**
 * CheckYourEmail Component
 *
 * Displayed after user requests a password reset.
 * Shows confirmation message and provides options to:
 * - Open email app
 * - Resend verification link (with countdown)
 * - Return to sign in
 * - View help information
 */
@Component({
  selector: 'app-check-your-email',
  templateUrl: './check-your-email.component.html',
  styleUrls: ['./check-your-email.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class CheckYourEmailComponent implements OnInit, OnDestroy {
  /**
   * Masked email address to display to user
   */
  maskedEmail: string = '';

  /**
   * Raw email address used for resend and provider lookup
   */
  private email: string | null = null;

  /**
   * Countdown timer for resend button
   */
  resendCountdown: number = 0;

  /**
   * Flag to enable/disable resend button
   */
  canResend: boolean = false;

  /**
   * Total resend timeout in seconds
   */
  readonly RESEND_TIMEOUT: number = 60;

  /**
   * Subject for managing component cleanup
   */
  private destroy$ = new Subject<void>();

  /**
   * Subscription for countdown timer
   */
  private countdownSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private forgotPasswordState: ForgotPasswordStateService
  ) {}

  /**
   * Initialize component - start resend countdown
   */
  ngOnInit(): void {
    this.email = this.forgotPasswordState.getEmailSnapshot();
    this.maskedEmail = this.email ? this.maskEmail(this.email) : 'your email';
    this.startResendCountdown();
  }

  /**
   * Cleanup subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  /**
   * Start the countdown timer for resend button
   * Emits every second and updates countdown value
   */
  private startResendCountdown(): void {
    this.resendCountdown = this.RESEND_TIMEOUT;
    this.canResend = false;

    this.countdownSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resendCountdown--;
        if (this.resendCountdown <= 0) {
          this.canResend = this.email !== null;
          if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
          }
        }
      });
  }

  /**
   * Handle resend reset link button click
   * Restarts countdown and sends new email
   */
  onResendClick(): void {
    if (!this.canResend) {
      return;
    }

    if (!this.email) {
      return;
    }

    this.authApi.resendPasswordReset(this.email).subscribe({
      next: () => this.startResendCountdown(),
      error: () => this.startResendCountdown()
    });
  }

  /**
   * Open email application or service
   * In production, this would open the native email app on mobile
   * or redirect to email service in browser
   */
  openEmailApp(): void {
    const fallbackUrl = 'https://mail.google.com/';
    const url = this.email ? findProviderLoginUrl(this.email) ?? fallbackUrl : fallbackUrl;
    window.open(url, '_blank', 'noopener');
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

  /**
   * Get current resend button display text
   * @returns Button text with countdown or resend label
   */
  getResendButtonText(): string {
    if (this.canResend) {
      return 'Resend';
    }
    return `Resend in ${this.resendCountdown}s`;
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain) {
      return email;
    }
    const maskedLocal = localPart.length > 1
      ? `${localPart.charAt(0)}***`
      : `${localPart.charAt(0)}*`;
    const domainParts = domain.split('.');
    const maskedDomain = domainParts.length > 1
      ? `${domainParts[0].charAt(0)}***.${domainParts.slice(1).join('.')}`
      : `${domain.charAt(0)}***`;
    return `${maskedLocal}@${maskedDomain}`;
  }
}
