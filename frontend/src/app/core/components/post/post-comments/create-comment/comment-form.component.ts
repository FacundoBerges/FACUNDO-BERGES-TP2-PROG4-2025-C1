import { Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { FormErrorService } from '@auth/services/form-error.service';

@Component({
  selector: 'sn-comment-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
    TextareaModule,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorService = inject(FormErrorService);
  public readonly submitCommentEvent = output<string>();
  public formLabel = input<string>('Añadir comentario');
  public commentForm = this.formBuilder.group({
    description: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    ],
  });

  public onSubmit() {
    const commentData = this.description?.value?.trim();

    if (this.commentForm.invalid || !commentData) return;

    this.submitCommentEvent.emit(commentData);
    this.commentForm.reset();
  }

  public getErrorMessage(controlName: string): string | void {
    return this.formErrorService.getErrorMessage(controlName, this.commentForm);
  }

  //* Getters for form controls

  public get description(): AbstractControl | null {
    return this.commentForm.get('description');
  }
}
