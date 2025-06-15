import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CheckoutRequest } from '../../models/CheckoutRequest';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private _clientservice:ClientService) { }
  checkinformation:CheckoutRequest= {} as CheckoutRequest

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
  }

}
