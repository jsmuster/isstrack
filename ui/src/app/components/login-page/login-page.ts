import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class LoginPage {
  usernameOrEmail = ''
  password = ''
  errorMessage = ''
  isSubmitting = false

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  onSubmit() {
    if (this.isSubmitting) {
      return
    }

    this.errorMessage = ''
    this.isSubmitting = true
    this.authService.login({ usernameOrEmail: this.usernameOrEmail, password: this.password }).subscribe({
      next: (response) => {
        this.authService.persistSession(response)
        this.isSubmitting = false
        this.router.navigate(['/app/projects'])
      },
      error: () => {
        this.errorMessage = 'Invalid credentials. Please try again.'
        this.isSubmitting = false
      }
    })
  }

  onGoogleSignIn() {
    // Handle Google sign in
  }

  onGithubSignIn() {
    // Handle GitHub sign in
  }
}
