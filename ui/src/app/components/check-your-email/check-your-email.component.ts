import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  imports: []
})
export class CheckYourEmailComponent implements OnInit, OnDestroy {
  /**
   * Masked email address to display to user
   */
  maskedEmail: string = 'j***@g***.com';

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

  constructor(private router: Router) {}

  /**
   * Initialize component - start resend countdown
   */
  ngOnInit(): void {
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
          this.canResend = true;
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

    // TODO: Call backend service to resend reset email
    // this.authService.resendPasswordReset(this.maskedEmail).subscribe(...)

    this.startResendCountdown();
  }

  /**
   * Open email application or service
   * In production, this would open the native email app on mobile
   * or redirect to email service in browser
   */
  openEmailApp(): void {
    // TODO: Implement platform-specific email app opening
    // Option 1: Use window.open with email client schemes
    // window.open('mailto:', '_blank');

    // Option 2: Deep link to common email apps on mobile
    // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // const isAndroid = /Android/.test(navigator.userAgent);
    // if (isIOS) window.open('googlegmail://');
    // if (isAndroid) window.open('intent://');
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
      return 'Resend link';
    }
    return `Resend in ${this.resendCountdown}s`;
  }
}
