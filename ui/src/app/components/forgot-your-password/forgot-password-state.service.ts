/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ForgotPasswordStateService {
  private readonly emailSubject = new BehaviorSubject<string | null>(null)
  readonly email$ = this.emailSubject.asObservable()

  setEmail(email: string): void {
    this.emailSubject.next(email)
  }

  getEmailSnapshot(): string | null {
    return this.emailSubject.value
  }
}
