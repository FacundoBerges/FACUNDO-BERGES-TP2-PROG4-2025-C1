import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  let confirmPasswordErrors: ValidationErrors | null = {
    ...confirmPassword.errors,
  };
  const passwordDoNotMatch = password.value !== confirmPassword.value;

  if (passwordDoNotMatch) {
    confirmPasswordErrors = {
      ...confirmPasswordErrors,
      passwordMismatch: true,
    };
  } else {
    delete confirmPasswordErrors?.['passwordMismatch'];
  }

  confirmPasswordErrors =
    Object.keys(confirmPasswordErrors).length === 0
      ? null
      : confirmPasswordErrors;

  confirmPassword.setErrors(confirmPasswordErrors);

  return confirmPasswordErrors;
};
