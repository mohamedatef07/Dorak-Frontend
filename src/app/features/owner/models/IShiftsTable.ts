import { IShiftServices } from "./IShiftServices";

export interface IShiftsTable {
  ProviderName: string;
  ShiftId: number;
  ShiftDate: string;      
  StartTime: string;      
  EndTime: string;        
  ProviderId: string;
  ServiceId: number;
  Services: IShiftServices[];
}

export type { IShiftServices };
