import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const USERNAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\-._]{3,99}$/;

export const invalidUsernameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value.trim();
  const isValid = USERNAME_REGEX.test(value);

  return !isValid
    ? { invalidUsername: { value: true } }
    : null;
};