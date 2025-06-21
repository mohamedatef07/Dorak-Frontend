import { IClientProfileAppointment } from "./IClientProfileAppointment"

export interface IClientProfile {
ID:string
Name:string
Street:string
City:string
Governorate:string
Country:string
Image:string
Phone:string
Email:string


  Appointments: Array<IClientProfileAppointment>
}
