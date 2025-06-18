export interface ICreateAppointment {
  FirstName?: string;           
  LastName?: string;             
  ContactInfo: string;
  AppointmentDate: string;       
  AppointmentStatus: number;
  AppointmentType: number;
  clientType: number;
  OperatorId: string;
  ProviderId: string;
  CenterId: number;
  ServiceId: number;
  ShiftId: number;
  Fees: number;
  AdditionalFees?: number;       
}
