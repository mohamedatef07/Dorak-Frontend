export interface IAppointment {
  appointmentId: number;
  FirstName: string|null;
  LastName: string|null;
  AppointmentDate: Date;
  //  AppointmentStatus AppointmentStatus = AppointmentStatus.Pending;
  CreatedAt: Date;
  UpdatedAt: Date;
  //  ClientType clientType
  Fees: number;
  AdditionalFees: number;//0 
  EstimatedTime: Date;
  ExactTime: Date;
  EndTime: Date;
  IsChecked: boolean;
  OperatorId: string|null;
  LiveQueueId: number|null; // CHANGED
  ProviderId: string|null;
  CenterId: number|null;
  ServiceId: number|null;
  ShiftId: number;
  UserId: string|null;
  TemporaryClientId: number|null;
}
