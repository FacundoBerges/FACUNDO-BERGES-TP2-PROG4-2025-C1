import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

export const invalidPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value?.trim();
  const isValid = PASSWORD_REGEX.test(value);

  return !isValid
    ? { invalidPassword: { value: true } }
    : null;
};