import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  public getErrorMessage(controlName: string, form: FormGroup<any>): string | void {
    const control: AbstractControl<any, any> | null = form.get(controlName);

    if (control?.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.hasError('email')) return 'El formato del email es inválido.';
    if (control?.hasError('minlength')) {
      const minLength: number = control.getError('minlength').requiredLength;
      return `El mínimo de caracteres es ${minLength}.`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength: number = control.getError('maxlength').requiredLength;
      return `El máximo de caracteres es ${maxLength}.`;
    }
    if (control?.hasError('min')) return 'El valor es menor al mínimo permitido.';
    if (control?.hasError('max')) return 'El valor es mayor al máximo permitido.';
    if (control?.hasError('pattern')) return 'La contraseña es demasiado débil. Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    if (control?.hasError('emailTaken')) return 'El email ya está en uso.';
    if (control?.hasError('userNotFound')) return 'El email o usuario no está registrado.';
    if (control?.hasError('passwordMismatch')) return 'Las contraseñas no coinciden.';
    if (control?.hasError('invalidBirthdate')) return 'La fecha de nacimiento es inválida. Debe ser en formato dd/mm/aaaa y no puede ser futura.';
    if (control?.hasError('invalidFileType')) return 'El tipo de archivo no es válido. Debe ser una imagen (jpg, jpeg, png).';
    if (control?.hasError('fileTooLarge')) {
      const maxSize: number = control.getError('fileTooLarge').maxSize;
      return `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSize / 1024 / 1024} MB.`;
    }
  }
}