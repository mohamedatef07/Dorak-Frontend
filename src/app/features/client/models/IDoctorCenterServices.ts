import { IDoctorService } from './IDoctorService';

export interface IDoctorCenterServices {
  CenterId: number;
  CenterName: string;
  Latitude: number;
  Longitude: number;
  Services: Array<IDoctorService>;
}
