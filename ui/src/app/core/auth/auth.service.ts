import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap, of } from 'rxjs'
import { apiUrl } from '../http/api.config'
import { AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../../models/api.models'
import { AuthStore } from '../state/auth.store'
import { TokenService } from './token.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly authStore: AuthStore,
    private readonly tokenService: TokenService
  ) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(apiUrl('/api/auth/register'), request)
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(apiUrl('/api/auth/login'), request)
  }

  me(): Observable<UserDto> {
    return this.http.get<UserDto>(apiUrl('/api/auth/me'))
  }

  persistSession(response: AuthResponse): void {
    this.tokenService.setToken(response.accessToken)
    this.authStore.setUser(response.user)
  }

  logout(): void {
    this.tokenService.clearToken()
    this.authStore.setUser(null)
  }

  restoreSession(): Observable<UserDto | null> {
    if (!this.tokenService.getToken()) {
      this.authStore.setUser(null)
      return of(null)
    }

    return this.me().pipe(
      tap((user) => this.authStore.setUser(user))
    )
  }
}
