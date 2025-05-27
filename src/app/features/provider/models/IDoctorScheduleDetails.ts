import { ShiftType } from '../../../Enums/ShiftType.enum';

export interface IDoctorScheduleDetails {
  CenterId: number;
  ShiftId: number;
  ShiftType: ShiftType;
  StartTime: Date;
  EndTime: Date;
  ShiftDate: Date;
}
