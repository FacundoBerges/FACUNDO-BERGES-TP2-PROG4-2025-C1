import { Component } from '@angular/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'sn-loading',
  imports: [ProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {}
