import { ClientType } from "../Enums/ClientType.enum";
import { QueueAppointmentStatus } from "../Enums/QueueAppointmentStatus.enum";


export interface IProviderLiveQueueViewModel {
  LiveQueueId: number;
  ClientFullName: string;
  ClientType: ClientType;
  EstimatedTime: string;
  ArrivalTime: string | null;
  Status: QueueAppointmentStatus;
  PhoneNumber: string;
  CurrentQueuePosition: number | null;
  AvailableStatuses: QueueAppointmentStatus[];
  ProviderName: string
}
