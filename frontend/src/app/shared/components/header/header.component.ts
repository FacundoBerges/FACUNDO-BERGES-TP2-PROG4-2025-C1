import { Component, inject } from '@angular/core';

import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MegaMenuModule } from 'primeng/megamenu';

import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'sn-header',
  imports: [AvatarModule, MegaMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public items: MegaMenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink: '/home/feed',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-fw pi-user',
      routerLink: '/home/profile',
    },
  ];
}
