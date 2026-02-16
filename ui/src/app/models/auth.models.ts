/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
export interface ForgotPasswordRequest {
  email: string
}

export interface ResendForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface GenericOkResponse {
  ok: true
}
