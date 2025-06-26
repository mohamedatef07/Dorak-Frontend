import { GenderType } from '../Enums/GenderType.enum';

export interface IOperatorViewModel {
  FirstName: string;
  LastName: string;
  Gender: GenderType;
  Image?: string;
  CenterId?: number;
}
