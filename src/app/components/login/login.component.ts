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
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

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
    ForgotPasswordComponent,
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  keepLoggedIn: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showForgotPasswordDialog = false;

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
        this.cookie.set('refreshToken', res.Data.RefreshToken);
        this.cookie.set('role', res.Data.Roles[0]);
        this.notificationsSR.startConnection();
        this.isLoading = false;
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back!',
          life: 4000,
        });
        if (res.Data.Roles.includes('Client')) {
          this.router.navigate(['/client/doctors']);
        } else if (
          res.Data.Roles.includes('Admin') ||
          res.Data.Roles.includes('Operator')
        ) {
          this.router.navigate(['/owner']);
        } else if (res.Data.Roles.includes('Provider')) {
          this.router.navigate(['/provider']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;

        // Handle different types of errors
        let errorMessage = 'Login failed. Please try again.';

        if (err.status === 401) {
          errorMessage =
            'Invalid username or password. Please check your credentials.';
        } else if (err.status === 404) {
          errorMessage = 'User not found. Please check your username or email.';
        } else if (err.status === 0 || err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.status === 403) {
          errorMessage =
            'Account is locked or disabled. Please contact support.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.messageService.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: errorMessage,
          life: 5000,
        });
      },
    });
  }

  onForgotPassword(): void {
    this.showForgotPasswordDialog = true;
  }

  onForgotPasswordClose(): void {
    this.showForgotPasswordDialog = false;
  }

  onSignUp(): void {
    this.router.navigate(['/register']);
  }

  onStartAcademy(): void {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private validateForm(): boolean {
    // Check if form is valid using Angular's built-in validation
    if (!this.email || !this.password) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000,
      });
      return false;
    }

    // Email/Username validation
    if (this.email.length < 8) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Username or email must be at least 8 characters long',
        life: 3000,
      });
      return false;
    }

    // Password validation
    if (this.password.length < 8) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Password must be at least 8 characters long',
        life: 3000,
      });
      return false;
    }

    if (this.password.indexOf(' ') >= 0) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Password must not contain spaces',
        life: 3000,
      });
      return false;
    }

    // Email format validation (if it looks like an email)
    if (this.email.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.messageService.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please enter a valid email address',
          life: 3000,
        });
        return false;
      }
    }
    return true;
  }
}
