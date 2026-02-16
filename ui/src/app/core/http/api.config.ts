/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { environment } from '../../environments/environment'

export function apiUrl(path: string): string {
  return `${environment.apiBaseUrl}${path}`
}
