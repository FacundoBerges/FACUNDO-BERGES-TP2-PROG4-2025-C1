import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { FormBodyComponent } from '../../components/shared/form/form-body/form-body.component';
import { FormComponent } from '../../components/shared/form/form.component';
import { FormFooterComponent } from '../../components/shared/form/form-footer/form-footer.component';
import { FormHeaderComponent } from '../../components/shared/form/form-header/form-header.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { FooterLinkText } from '../../interfaces/footer-link-text';

@Component({
  selector: 'sn-register-page',
  imports: [
    ButtonModule,
    FormBodyComponent,
    FormComponent,
    FormFooterComponent,
    FormHeaderComponent,
    RegisterFormComponent,
    RouterModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  public footerLink = signal<FooterLinkText>({
    text: 'Ingresá',
    url: '/auth/login',
  });
}
