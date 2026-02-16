/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
type RuntimeEnv = {
  API_URL?: string
  CLIENT_URL?: string
}

const runtimeEnv: RuntimeEnv =
  typeof window !== 'undefined'
    ? ((window as { __env?: RuntimeEnv }).__env ?? {})
    : {}

const apiBaseUrl = runtimeEnv.API_URL || 'http://localhost:8080'
const wsUrl = apiBaseUrl.replace(/^http/, 'ws') + '/ws'

export const environment = {
  apiBaseUrl,
  wsUrl,
}
