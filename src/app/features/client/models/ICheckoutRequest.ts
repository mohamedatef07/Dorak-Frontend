export interface ICheckoutRequest {
  AppointmentId:number;
  ClientId:string|null;
  StripeToken:string;
  Amount:number;
}
