import { AbstractControl, ValidationErrors } from '@angular/forms';

const ALPHA_ONLY_REGEX = /^[a-zA-ZñÑ\s]*$/;

export const alphaOnlyValidator = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value.trim();
  const isValid = ALPHA_ONLY_REGEX.test(value);

  return isValid 
    ? null
    : { alphaOnly: { value: false } 
  };
};
