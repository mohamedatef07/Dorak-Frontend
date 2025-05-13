import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ILoginRequest } from '../../types/ILoginRequest';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //Custom Validators
  NoWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasWhiteSpace = value.indexOf(' ') >= 0;
    return hasWhiteSpace ? { whiteSpace: true } : null;
  }
  fb = inject(FormBuilder);
  authServices = inject(AuthService);
  router = inject(Router);
  cookie = inject(CookieService);
  loginStatus!: String;
  showPassword = false;
  loginForm = this.fb.group({
    userName: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        this.NoWhiteSpaceValidator,
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });
  handelLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const LoginData: ILoginRequest = {
      UserName: this.loginForm.value.userName || '',
      Password: this.loginForm.value.password || '',
      RememberMe: this.loginForm.value.rememberMe || '',
    };
    const rememberMe = this.loginForm.value.rememberMe;
    this.authServices.logIn(LoginData).subscribe({
      next: (res) => {
        this.cookie.set('token', res.Data.Token);
        this.cookie.set('role', res.Data.Roles[0]);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginStatus = 'Invalid Password or User Name';
      },
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  // HandelLogOut() {
  //   this.authServices.logOut().subscribe({
  //     next: (res) => {
  //       this.router.navigate(['/login']);
  //     },
  //   });
  // }
}
