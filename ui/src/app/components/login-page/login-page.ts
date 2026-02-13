import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "'contents'" }
})
export class LoginPage {
  onSubmit() {
    // Handle form submission
  }

  onGoogleSignIn() {
    // Handle Google sign in
  }

  onGithubSignIn() {
    // Handle GitHub sign in
  }
}
