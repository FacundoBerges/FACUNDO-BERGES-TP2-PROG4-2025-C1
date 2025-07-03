import {
  Component,
  signal,
  effect,
  input,
  output,
  EffectRef,
  OnDestroy,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';

import { Comment } from '@core/interfaces';

@Component({
  selector: 'sn-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css',
  standalone: true,
  imports: [ButtonModule, DialogModule, TextareaModule],
})
export class EditDialogComponent implements OnDestroy {
  private editedContentEffectRef?: EffectRef;
  public readonly updated = output<Comment>();
  public readonly closed = output<void>();
  public visible = input<boolean>(false);
  public comment = input.required<Comment>();
  public editedContent = signal('');

  constructor() {
    this.editedContentEffectRef = effect(() => {
      if (this.comment()) {
        this.editedContent.set(this.comment().content);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.editedContentEffectRef) {
      this.editedContentEffectRef.destroy();
      this.editedContentEffectRef = undefined;
    }
  }

  onSave() {
    if (this.editedContent().trim()) {
      this.updated.emit({ ...this.comment(), content: this.editedContent() });
      this.closed.emit();
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
