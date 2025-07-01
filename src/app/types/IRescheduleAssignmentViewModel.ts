import { IShiftViewModel } from './IShiftViewModel';

export interface IRescheduleAssignmentViewModel {
  ProviderId: string;
  CenterId: number;
  StartDate?: Date | string;
  EndDate?: Date | string;
  WorkingDays?: number[];
  Shifts?: IShiftViewModel[];
}
