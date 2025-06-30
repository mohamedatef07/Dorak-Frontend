import { AppointmentStatus } from '../../../Enums/AppointmentStatus.enum';

export interface IClientAppointmentCard {
  AppointmentId: number;
  ProviderId: string;
  ProviderName: string;
  ProviderRate: number;
  Specialization: string;
  AppointmentDate: Date;
  AppointmentStatus: AppointmentStatus;
  EstimatedTime: Date;
}
