export interface IShiftViewModel {
  ShiftType: number;
  ShiftDate?: String;
  StartTime: string;
  EndTime: string;
  MaxPatientsPerDay: number | null;
  OperatorId: string;
}
