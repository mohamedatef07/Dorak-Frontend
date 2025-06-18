export interface ICheckoutRequest {
  AppointmentId:number;
  ClientId:string;
  StripeToken:string;
  Amount:number;

}
