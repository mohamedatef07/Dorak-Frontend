import { ShiftType } from "../Enums/ShiftType.enum";

export interface IShift {
  ShiftId: number;
  ShiftType: ShiftType;
  ShiftDate: string;
  StartTime: string;
  EndTime: string;
  MaxPatientsPerDay: number | null;
  CenterId: number;
  OperatorId: string | null;
  ProviderId: string | null;
}
