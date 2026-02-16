/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apiUrl } from '../http/api.config'
import {
  ForgotPasswordRequest,
  GenericOkResponse,
  ResendForgotPasswordRequest,
  ResetPasswordRequest
} from '../../models/auth.models'

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  requestPasswordReset(email: string): Observable<GenericOkResponse> {
    const payload: ForgotPasswordRequest = { email }
    return this.http.post<GenericOkResponse>(apiUrl('/api/auth/forgot-password'), payload)
  }

  resendPasswordReset(email: string): Observable<GenericOkResponse> {
    const payload: ResendForgotPasswordRequest = { email }
    return this.http.post<GenericOkResponse>(apiUrl('/api/auth/forgot-password/resend'), payload)
  }

  validateResetToken(token: string): Observable<GenericOkResponse> {
    return this.http.get<GenericOkResponse>(apiUrl('/api/auth/reset-password/validate'), {
      params: { token }
    })
  }

  resetPassword(token: string, newPassword: string): Observable<GenericOkResponse> {
    const payload: ResetPasswordRequest = { token, newPassword }
    return this.http.post<GenericOkResponse>(apiUrl('/api/auth/reset-password'), payload)
  }
}
