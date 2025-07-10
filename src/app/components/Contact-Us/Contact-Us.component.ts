import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../services/api.service';
import { IContactEmail } from '../../types/IContactEmail';

@Component({
  selector: 'app-Contact-Us',
  templateUrl: './Contact-Us.component.html',
  styleUrls: ['./Contact-Us.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ContactUsComponent implements OnInit {
  
  // Contact form data
  contactForm: IContactEmail = {
    Name: '',
    Email: '',
    Phone: '',
    Subject: '',
    Message: '',
    CenterName: '',
    InquiryType: ''
  };

  // Inquiry type options
  inquiryTypes = [
    { label: 'General Inquiry', value: 'general' },
    { label: 'Technical Support', value: 'technical' },
    { label: 'Sales & Pricing', value: 'sales' },
    { label: 'Partnership', value: 'partnership' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Bug Report', value: 'bug' },
    { label: 'Other', value: 'other' }
  ];

  isLoading = false;

  // Contact information
  contactInfo = {
    email: 'dorak.helpdesk@gmail.com',
    phone: '(+20) 109 999 9999',
    address: 'ITI Aswan, Sahary City, Aswan, Egypt',
    businessHours: 'Sunday - Friday: 9:00 AM - 6:00 PM (UTC+02:00)',
    emergencySupport: '24/7 Technical Support Available'
  };

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  // Form validation
  isFormValid(): boolean {
    return (
      this.contactForm.Name.trim() !== '' &&
      this.contactForm.Email.trim() !== '' &&
      this.isValidEmail(this.contactForm.Email) &&
      this.contactForm.Message.trim() !== ''
    );
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Submit contact form
  onSubmit() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly',
        life: 3000
      });
      return;
    }

    this.isLoading = true;

    // Prepare the request payload
    const emailData: IContactEmail = {
      Name: this.contactForm.Name,
      Email: this.contactForm.Email,
      Phone: this.contactForm.Phone || undefined,
      CenterName: this.contactForm.CenterName || undefined,
      InquiryType: this.contactForm.InquiryType,
      Subject: this.contactForm.Subject,
      Message: this.contactForm.Message
    };

    // Remove undefined values
    Object.keys(emailData).forEach(key => {
      if (emailData[key as keyof IContactEmail] === undefined) {
        delete emailData[key as keyof IContactEmail];
      }
    });

    // Send email via API service
    this.apiService.sendEmail(emailData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Message Sent Successfully',
          detail: 'Thank you for contacting us! We will get back to you within 24 hours.',
          life: 5000
        });
        
        // Reset form
        this.contactForm = {
          Name: '',
          Email: '',
          Phone: '',
          Subject: '',
          Message: '',
          CenterName: '',
          InquiryType: ''
        };
      },
      error: (error) => {
        this.isLoading = false;
        
        let errorMessage = 'Failed to send message. Please try again.';
        
        if (error.status === 400) {
          // Try to get more specific error message from the API response
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            // Handle validation errors
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = validationErrors.join(', ');
          } else {
            errorMessage = 'Please check your input and try again.';
          }
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Message Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  // Quick contact actions
  onEmailClick() {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  onPhoneClick() {
    window.location.href = `tel:${this.contactInfo.phone}`;
  }
}
