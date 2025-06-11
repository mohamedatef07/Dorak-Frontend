import { IShiftViewModel } from './IShiftViewModel';

export interface IWeeklyProviderAssignmentViewModel {
  ProviderId: string;
  CenterId: number;
  StartDate: string | null;
  AssignmentType: number;
  WorkingDays: number[];
  Shifts: IShiftViewModel[];
}
