import { ClientType } from '../../../Enums/ClientType.enum';
import { QueueAppointmentStatus } from '../../../Enums/QueueAppointmentStatus.enum';

export interface IQueueEntries {
  FullName: string;
  PhoneNumber: string;
  CurrentQueuePosition: number | null;
  ArrivalTime: Date;
  AppointmentDate: Date;
  ClientType: ClientType;
  Status: QueueAppointmentStatus;
}
