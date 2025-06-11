import { IShiftViewModel } from './IShiftViewModel';

export interface IProviderAssignmentViewModel {
  ProviderId: string;
  CenterId: number;
  StartDate: string | null;
  EndDate: string | null;
  AssignmentType: number;
  Shifts: IShiftViewModel[];
}
