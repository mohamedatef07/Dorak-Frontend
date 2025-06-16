import { ClientType } from "../Enums/ClientType.enum";
import { QueueAppointmentStatus } from "../Enums/QueueAppointmentStatus.enum";


export interface IProviderLiveQueueViewModel {
  LiveQueueId: number;
  ClientFullName: string;
  ClientType: ClientType; // Enum
  EstimatedTime: string; // Match API string format
  ArrivalTime: string | null; // Match API nullability
  Status: QueueAppointmentStatus; // Enum
  PhoneNumber: string;
  CurrentQueuePosition: number | null;
  AvailableStatuses: QueueAppointmentStatus[]; // Enum array
}
