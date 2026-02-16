/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { TokenService } from '../auth/token.service'
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly tokenService: TokenService, private readonly router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken()
    const isApiRequest = request.url.startsWith(environment.apiBaseUrl) || request.url.startsWith('/api')

    const authRequest = token && isApiRequest
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.tokenService.clearToken()
          this.router.navigate(['/login'])
        }
        return throwError(() => error)
      })
    )
  }
}
