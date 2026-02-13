import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'create-account-page',
  imports: [CommonModule],
  templateUrl: './create-account-page.html',
  styleUrls: ['./create-account-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class CreateAccountPage {
  // Form state
  email = signal('');
  username = signal('');
  firstName = signal('');
  lastName = signal('');
  password = signal('');
  termsAgreed = signal(false);

  // Password validation requirements
  passwordRequirements = signal({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  });

  onPasswordChange(password: string) {
    this.password.set(password);
    this.updatePasswordRequirements(password);
  }

  private updatePasswordRequirements(password: string) {
    this.passwordRequirements.set({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    });
  }

  isPasswordValid(): boolean {
    const requirements = this.passwordRequirements();
    return requirements.minLength && requirements.hasUppercase && 
           requirements.hasLowercase && requirements.hasNumber;
  }

  onSubmit() {
    if (!this.email() || !this.username() || !this.firstName() || !this.lastName() || !this.password()) {
      console.error('All fields are required');
      return;
    }

    if (!this.isPasswordValid()) {
      console.error('Password does not meet requirements');
      return;
    }

    if (!this.termsAgreed()) {
      console.error('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Handle form submission
    console.log('Account creation:', {
      email: this.email(),
      username: this.username(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      password: this.password()
    });
  }

  onGoogleSignUp() {
    // Handle Google sign up
    console.log('Sign up with Google');
  }

  onGithubSignUp() {
    // Handle GitHub sign up
    console.log('Sign up with GitHub');
  }

  onSignIn() {
    // Navigate to sign in page
    console.log('Navigate to sign in');
  }
}
