import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function passwordPolicyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '')
    if (!value) {
      return null
    }
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /\d/.test(value)
    const hasSymbol = /[^A-Za-z0-9]/.test(value)
    const minLength = value.length >= 8
    return hasUpper && hasLower && hasNumber && hasSymbol && minLength
      ? null
      : { passwordPolicy: true }
  }
}
