export interface ICreateAppointment {
  AppointmentDate: string;       
  AppointmentStatus: number;
  AppointmentType: number;
  clientType: number;
  Fees: number;
  AdditionalFees?: number;       
  OperatorId: string;
  ProviderId: string;
  CenterId: number;
  ServiceId: number;
  ShiftId: number;
  ContactInfo: string;
  FirstName?: string;           
  LastName?: string;             
}
