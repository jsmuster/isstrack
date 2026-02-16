import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * SetANewPassword Component
 *
 * Allows users to reset their password with validation for:
 * - Minimum 8 characters
 * - At least one number
 * - At least one symbol
 * - Upper and lowercase letters
 * - Password confirmation matching
 */
@Component({
  selector: 'app-set-a-new-password',
  templateUrl: './set-a-new-password.component.html',
  styleUrls: ['./set-a-new-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SetANewPasswordComponent {
  /**
   * Password reset form
   */
  passwordForm: FormGroup;

  /**
   * Track password visibility toggle
   */
  showPassword: boolean = false;

  /**
   * Track confirm password visibility toggle
   */
  showConfirmPassword: boolean = false;

  /**
   * Form submitted flag
   */
  isSubmitted: boolean = false;

  /**
   * Password validation checklist
   */
  passwordRequirements = {
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
    hasUpperLower: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  /**
   * Check and update password requirements on input
   * @param password Password to validate
   */
  onPasswordChange(password: string): void {
    this.passwordRequirements = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password)
    };
  }

  /**
   * Check if all password requirements are met
   * @returns true if all requirements pass
   */
  isPasswordValid(): boolean {
    return Object.values(this.passwordRequirements).every(req => req);
  }

  /**
   * Check if passwords match
   * @returns true if both passwords are equal
   */
  doPasswordsMatch(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword === confirmPassword;
  }

  /**
   * Handle password reset form submission
   */
  onSubmit(): void {
    this.isSubmitted = true;

    if (!this.passwordForm.valid) {
      return;
    }

    if (!this.isPasswordValid()) {
      return;
    }

    if (!this.doPasswordsMatch()) {
      return;
    }

    // TODO: Call backend service to update password
    // this.authService.resetPassword(this.passwordForm.get('newPassword')?.value).subscribe(
    //   (response) => {
    //     this.router.navigate(['/login']);
    //   },
    //   (error) => {
    //     // Handle error
    //   }
    // );

    this.router.navigate(['/login']);
  }

  /**
   * Toggle new password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Navigate back to sign in page
   */
  backToSignIn(): void {
    this.router.navigate(['/login']);
  }
}
