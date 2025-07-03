import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { LoadingService } from './shared/services/loading.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'sn-root',
  imports: [RouterOutlet, ToastModule, HeaderComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent {
  public readonly loadingService = inject(LoadingService);
}
