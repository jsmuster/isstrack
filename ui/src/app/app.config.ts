import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/http/auth.interceptor';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([(req, next) => inject(AuthInterceptor).intercept(req, next)])),
    provideRouter(routes),
    provideAppInitializer(() => {
      const authService = inject(AuthService)
      return () => firstValueFrom(authService.restoreSession().pipe(catchError(() => of(null))))
    })
  ]
};
