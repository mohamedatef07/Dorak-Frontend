import { ClientType } from '../../../Enums/ClientType.enum';
import { QueueAppointmentStatus } from '../../../Enums/QueueAppointmentStatus.enum';

export interface IClientLiveQueue {
  CurrentQueuePosition: number;
  ArrivalTime?: Date;
  AppointmentDate: Date;
  Type: ClientType;
  Status: QueueAppointmentStatus;
  IsCurrentClient: boolean;
  AppointmentId: number;
  EstimatedDuration : number;
}
