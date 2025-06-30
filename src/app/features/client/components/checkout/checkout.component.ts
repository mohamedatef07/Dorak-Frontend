import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ICheckoutRequest } from '../../models/ICheckoutRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../navBar/navBar.component';
import { ClientFooterComponent } from '../client-footer/client-footer.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, NavBarComponent, ClientFooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  messageServices = inject(MessageService);
  route = inject(Router);
  checkoutRequest: ICheckoutRequest = {
    AppointmentId: 0,
    ClientId: '',
    StripeToken: 'tok_visa',
    Amount: 0,
  };

  constructor(
    private _clientservice: ClientService,
    private activatedRoute: ActivatedRoute
  ) {}

  paymentMethods = [
    { label: 'Credit Card', value: 'credit' },
    { label: 'My Wallet', value: 'wallet' },
    { label: 'Easy Pay', value: 'easypay' },
  ];

  selectedPaymentMethod: string = 'credit'; // Default payment method

  clientCheckout(): void {
    this._clientservice.Checkout(this.checkoutRequest).subscribe({
      next: (res) => {
        this.messageServices.add({
          severity: 'success',
          summary: 'success',
          detail: 'Your Appointment has been booked successfully',
          life: 4000,
        });
        this.route.navigate(['/home']);
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }

  onPaymentMethodChange(paymentMethod: string): void {
    this.selectedPaymentMethod = paymentMethod;

    // Update Stripe token if 'Credit Card' is selected
    if (this.selectedPaymentMethod === 'credit') {
      this.checkoutRequest.StripeToken = 'tok_visa'; // Set the Stripe token (replace with real token)
    } else {
      this.checkoutRequest.StripeToken = ''; // Clear Stripe token if another payment method is selected
    }
  }

  ngOnInit() {
    const state = history.state;
    if (state && state.checkoutRequest) {
      this.checkoutRequest = state.checkoutRequest;
      this.checkoutRequest.StripeToken = 'tok_visa'; // Default Stripe token for testing
    }
  }
}
