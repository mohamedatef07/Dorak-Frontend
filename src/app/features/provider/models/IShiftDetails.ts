import { ShiftType } from '../../../Enums/ShiftType.enum';

export interface IShiftDetails {
  CenterId: number;
  ShiftId: number;
  ShiftType: ShiftType;
  TotalAppointments: number;
  ApprovedAppointments: number;
  PendingAppointments: number;
  EstimatedDuration: number;
  StartTime: Date;
  EndTime: Date;
}
