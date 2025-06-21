import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  public getErrorMessage(
    controlName: string,
    form: FormGroup<any>
  ): string | void {
    const control: AbstractControl<any, any> | null = form.get(controlName);

    //* built-in validators

    if (control?.hasError('required')) return 'Este campo es obligatorio.';

    if (control?.hasError('requiredTrue'))
      return 'Este campo debe ser verdadero.';

    if (control?.hasError('min'))
      return 'El valor es menor al mínimo permitido.';

    if (control?.hasError('max'))
      return 'El valor es mayor al máximo permitido.';

    if (control?.hasError('email')) return 'El formato del email es inválido.';

    if (control?.hasError('minlength')) {
      const minLength: number = control.getError('minlength').requiredLength;
      return `El tamaño requerido es de mínimo ${minLength} caracteres.`;
    }

    if (control?.hasError('maxlength')) {
      const maxLength: number = control.getError('maxlength').requiredLength;
      return `El tamaño máximo permitido es de ${maxLength} caracteres.`;
    }

    //* custom validators
    if (control?.hasError('alphaOnly') && controlName === 'name') {
      return 'El nombre solo puede contener letras y espacios.';
    }

    if (control?.hasError('alphaOnly') && controlName === 'surname') {
      return 'El apellido solo puede contener letras y espacios.';
    }

    if (control?.hasError('invalidPassword')) {
      return 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    }

    if (control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden.';
    }

    if (control?.hasError('invalidBirthdate')) {
      return 'La fecha debe estar en formato dd/mm/aaaa.';
    }

    if (control?.hasError('futureDate')) {
      return 'La fecha no puede ser futura.';
    }

    if (control?.hasError('pattern') && controlName === 'username') {
      return 'El nombre de usuario solo puede contener letras, números, guiones bajos y guiones medios.';
    }

    if (control?.hasError('emailTaken'))
      return 'El email ya se encuentra registrado.';

    if (control?.hasError('usernameTaken'))
      return 'El nombre de usuario ya está en uso.';

    if (control?.hasError('invalidCredentials'))
      return 'Las credenciales proporcionadas son inválidas.';

    if (control?.hasError('userNotFound'))
      return 'El email o usuario no está registrado.';

    if (control?.hasError('invalidBirthdate'))
      return 'La fecha de nacimiento es inválida. Debe ser en formato dd/mm/aaaa y no puede ser futura.';

    if (control?.hasError('invalidFileType'))
      return 'El tipo de archivo no es válido. Debe ser una imagen (jpg, jpeg, png).';

    if (control?.hasError('fileTooLarge')) {
      const maxSize: number = control.getError('fileTooLarge').maxSize;
      return `El archivo es demasiado grande. El tamaño máximo permitido es ${
        maxSize / 1024 / 1024
      } MB.`;
    }
  }
}
