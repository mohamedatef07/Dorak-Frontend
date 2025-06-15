import { ClientType } from './Enums/ClientType';
import { QueueAppointmentStatus } from './Enums/QueueAppointmentStatus';

export interface IProviderLiveQueueViewModel {
  LiveQueueId: number;
  ClientFullName: string;
  ClientType: ClientType;
  EstimatedTime: string;
  ArrivalTime: string | null;
  Status: QueueAppointmentStatus; // Enum
  PhoneNumber: string;
  CurrentQueuePosition: number | null;
  AvailableStatuses: QueueAppointmentStatus[];
}
