import { ShiftType } from '../../../Enums/ShiftType.enum';
export interface ICenterShifts {
  ProviderName: string;
  ShiftId: number;
  ShiftDate: Date;
  StartTime: Date;
  EndTime: Date;
  ShiftType: ShiftType;
}
