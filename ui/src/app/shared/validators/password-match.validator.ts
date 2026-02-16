import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function passwordMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!group) {
      return null
    }

    const passwordControl = group.get(passwordKey)
    const confirmControl = group.get(confirmKey)
    if (!passwordControl || !confirmControl) {
      return null
    }

    const matches = passwordControl.value === confirmControl.value
    return matches ? null : { passwordMismatch: true }
  }
}
