import { IClientProfileAppointment } from "./IClientProfileAppointment"

export interface IClientProfile {
     ID:string
  Name:string
 

  Image:string
  Phone:string
  Email:string


  Appointments: Array<IClientProfileAppointment>
}
