import { Component, computed, inject } from '@angular/core';

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
  public readonly items = computed<MegaMenuItem[]>(() => {
    const items: MegaMenuItem[] = [
      {
        label: 'Inicio',
        title: 'Ir al feed',
        icon: 'pi pi-fw pi-home',
        routerLink: '/home/feed',
      },
      {
        label: 'Perfil',
        title: 'Ir al perfil',
        icon: 'pi pi-fw pi-user',
        routerLink: '/home/profile',
      },
    ];

    if (this.authService.currentUser?.profile === 'admin') {
      items.push({
        label: 'Administración',
        icon: 'pi pi-fw pi-shield',
        items: [
          [
            {
              label: 'Usuarios',
              items: [
                {
                  label: 'Gestionar usuarios',
                  icon: 'pi pi-fw pi-users',
                  routerLink: '/home/admin/users',
                },
              ],
            },
            {
              label: 'Estadísticas',
              items: [
                {
                  label: 'Ver estadísticas',
                  icon: 'pi pi-fw pi-chart-bar',
                  routerLink: '/home/admin/stats',
                },
              ],
            },
          ],
        ],
      });
    }

    if (this.authService.currentUser) {
      items.push({
        label: 'Cerrar sesión',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.authService.logout(),
      });
    }

    return items;
  });
}
