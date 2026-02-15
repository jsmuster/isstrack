import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'
import { firstValueFrom, of } from 'rxjs'
import { catchError } from 'rxjs'
import { provideQuillConfig } from 'ngx-quill/config'

import { routes } from './app.routes'
import { AuthInterceptor } from './core/http/auth.interceptor'
import { AuthService } from './core/auth/auth.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(routes),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'code-block', 'clean']
        ]
      }
    }),
    provideAppInitializer(() =>
      firstValueFrom(inject(AuthService).restoreSession().pipe(catchError(() => of(null))))
    )
  ]
}
