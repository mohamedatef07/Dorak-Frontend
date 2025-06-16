import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ICheckoutRequest } from '../../models/ICheckoutRequest';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutRequest: ICheckoutRequest = {
    AppointmentId: 0,
    ClientId: '',
    StripeToken: '',
    Amount: 0
  };

  constructor(private _clientservice:ClientService,private route: ActivatedRoute) { }
  checkinformation:ICheckoutRequest= {} as ICheckoutRequest

  paymentMethods = [
    { label: 'Credit Card', value: 'credit' },
    { label: 'My Wallet', value: 'wallet' },
    { label: 'Easy Pay', value: 'easypay' }
  ];

  clientcheckout():void{
    this._clientservice.Checkout(this.checkinformation).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  ngOnInit() {
    const state = history.state;
    if (state && state.checkoutRequest) {
      this.checkoutRequest = state.checkoutRequest;
    }
    console.log('Checkout Request:', this.checkoutRequest);
  }

}
