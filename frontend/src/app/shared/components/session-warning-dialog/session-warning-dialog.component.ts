import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'sn-session-warning-dialog',
  imports: [ButtonModule, DialogModule],
  templateUrl: './session-warning-dialog.component.html',
  styleUrl: './session-warning-dialog.component.css',
})
export class SessionWarningDialogComponent {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  public onContinue(): void {
    this.ref.close(true);
  }

  public onCancel(): void {
    this.ref.close(false);
  }
}
