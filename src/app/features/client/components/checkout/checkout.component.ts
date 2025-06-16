import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ICheckoutRequest } from '../../models/ICheckoutRequest';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutRequest: ICheckoutRequest = {
    AppointmentId: 0,
    ClientId: '',
    StripeToken: 'tok_visa',
    Amount: 0
  };

  constructor(private _clientservice:ClientService,private route: ActivatedRoute) { }
  

  paymentMethods = [
    { label: 'Credit Card', value: 'credit' },
    { label: 'My Wallet', value: 'wallet' },
    { label: 'Easy Pay', value: 'easypay' }
  ];

  selectedPaymentMethod: string = 'credit';  // Default payment method

  clientcheckout():void{
    console.log(this.checkoutRequest);
    this._clientservice.Checkout(this.checkoutRequest).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }



  onPaymentMethodChange(paymentMethod: string): void {
    this.selectedPaymentMethod = paymentMethod;

    // Update Stripe token if 'Credit Card' is selected
    if (this.selectedPaymentMethod === 'credit') {
      this.checkoutRequest.StripeToken = 'tok_visa';  // Set the Stripe token (replace with real token)
    } else {
      this.checkoutRequest.StripeToken = '';  // Clear Stripe token if another payment method is selected
    }
  }



  ngOnInit() {
    const state = history.state;
    if (state && state.checkoutRequest) {
      this.checkoutRequest = state.checkoutRequest;
      this.checkoutRequest.StripeToken = 'tok_visa'; // Default Stripe token for testing
    }
    console.log('Checkout Request:', this.checkoutRequest);
  }

}
