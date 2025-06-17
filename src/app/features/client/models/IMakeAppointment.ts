export interface IMakeAppointment {
  
  AppointmentDate: Date;
  Fees: number | undefined;
  UserId: string;
  ProviderId: string;
  ShiftId: number | undefined;
  ServiceId: number | undefined;
  CenterId: number | undefined;
}
