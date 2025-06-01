import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { FormComponent } from '../../components/shared/form/form.component';
import { FormHeaderComponent } from '../../components/shared/form/form-header/form-header.component';
import { FormBodyComponent } from '../../components/shared/form/form-body/form-body.component';
import { FormFooterComponent } from '../../components/shared/form/form-footer/form-footer.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { FooterLinkText } from '../../interfaces/footer-link-text';

@Component({
  selector: 'sn-login-page',
  imports: [
    ButtonModule,
    FormComponent,
    FormHeaderComponent,
    FormBodyComponent,
    FormFooterComponent,
    LoginFormComponent,
    RouterModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  public footerLink = signal<FooterLinkText>({
    text: 'Regístrate',
    url: '/auth/register',
  });
}
