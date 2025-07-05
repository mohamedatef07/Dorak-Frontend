import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsSRService } from '../../services/signalR Services/notificationsSR.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    ToastModule,
    RouterModule,
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  keepLoggedIn: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private notificationsSR: NotificationsSRService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin(): void {
    if (!this.validateForm()) return;
    this.isLoading = true;
    const loginData = {
      UserName: this.email,
      Password: this.password,
      RememberMe: this.keepLoggedIn,
    };
    this.authService.logIn(loginData).subscribe({
      next: (res) => {
        this.cookie.set('token', res.Data.Token);
        this.notificationsSR.startConnection();
        this.cookie.set('role', res.Data.Roles[0]);
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back!',
          life: 3000,
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid Password or User Name',
          life: 3000,
        });
      },
    });
  }



  onForgotPassword(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Forgot Password',
      detail: 'Password reset functionality would be implemented here',
      life: 3000,
    });
  }

  onSignUp(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Sign Up',
      detail: 'Sign up functionality would be implemented here',
      life: 3000,
    });
  }

  onStartAcademy(): void {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private validateForm(): boolean {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000,
      });
      return false;
    }
    if (this.email.length < 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Username or email must be at least 4 characters long',
        life: 3000,
      });
      return false;
    }
    if (this.password.length < 8) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Password must be at least 8 characters long',
        life: 3000,
      });
      return false;
    }
    if (this.password.indexOf(' ') >= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Password must not contain spaces',
        life: 3000,
      });
      return false;
    }
    return true;
  }
}