/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable, signal, computed } from '@angular/core'
import { UserDto } from '../../models/api.models'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly currentUser = signal<UserDto | null>(null)
  readonly isAuthenticated = computed(() => this.currentUser() !== null)

  setUser(user: UserDto | null): void {
    this.currentUser.set(user)
  }
}
