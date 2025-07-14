import { ShiftType } from "../../../Enums/ShiftType.enum";
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
  AppointmentCount: number;
  shiftType: ShiftType

}

export type { IShiftServices };
