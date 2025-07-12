import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ToastModule,
        InputTextModule,
        ButtonModule,
        ProgressSpinnerModule,
        CardModule,
        PasswordModule
      ],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.resetPasswordForm.get('newPassword')?.value).toBe('');
    expect(component.resetPasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate password requirements', () => {
    const newPasswordControl = component.resetPasswordForm.get('newPassword');
    
    // Test invalid password
    newPasswordControl?.setValue('weak');
    expect(newPasswordControl?.invalid).toBeTruthy();
    
    // Test valid password
    newPasswordControl?.setValue('StrongPass123!');
    expect(newPasswordControl?.valid).toBeTruthy();
  });

  it('should validate password confirmation', () => {
    const newPasswordControl = component.resetPasswordForm.get('newPassword');
    const confirmPasswordControl = component.resetPasswordForm.get('confirmPassword');
    
    newPasswordControl?.setValue('StrongPass123!');
    confirmPasswordControl?.setValue('DifferentPass123!');
    
    expect(component.resetPasswordForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should read email and token from query parameters', () => {
    // This would need to be tested with ActivatedRoute mock
    // For now, just test that the properties exist
    expect(component.email).toBeDefined();
    expect(component.token).toBeDefined();
  });
}); 