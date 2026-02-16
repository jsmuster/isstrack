/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Component, ChangeDetectionStrategy, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'

@Component({
  selector: 'create-account-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-account-page.html',
  styleUrls: ['./create-account-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccountPage {
  email = ''
  username = ''
  firstName = ''
  lastName = ''
  password = ''
  termsAgreed = false
  errorMessage = ''
  isSubmitting = false

  passwordRequirements = signal({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  })

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  onPasswordChange(password: string) {
    this.password = password
    this.updatePasswordRequirements(password)
  }

  private updatePasswordRequirements(password: string) {
    this.passwordRequirements.set({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    })
  }

  isPasswordValid(): boolean {
    const requirements = this.passwordRequirements()
    return requirements.minLength && requirements.hasUppercase && requirements.hasLowercase && requirements.hasNumber
  }

  onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!this.email || !this.username || !this.firstName || !this.lastName || !this.password) {
      this.errorMessage = 'All fields are required.'
      return
    }

    if (!this.isPasswordValid()) {
      this.errorMessage = 'Password does not meet requirements.'
      return
    }

    if (!this.termsAgreed) {
      this.errorMessage = 'You must agree to the Terms of Service and Privacy Policy.'
      return
    }

    this.errorMessage = ''
    this.isSubmitting = true
    this.authService.register({
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.persistSession(response)
        this.isSubmitting = false
        this.router.navigate(['/app/projects'])
      },
      error: () => {
        this.errorMessage = 'Unable to create account. Please try again.'
        this.isSubmitting = false
      }
    })
  }

  onGoogleSignUp() {
    console.log('Sign up with Google')
  }

  onGithubSignUp() {
    console.log('Sign up with GitHub')
  }

  onSignIn() {
    this.router.navigate(['/login'])
  }
}


