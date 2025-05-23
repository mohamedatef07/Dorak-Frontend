import { IAppointment } from "./IAppointment";

export interface IClientProfileAppointment {
 ID :number;
 Image :string;
 Name :string;
 Phone :string;
 Email :string;
 Appointments: IAppointment[];
}
