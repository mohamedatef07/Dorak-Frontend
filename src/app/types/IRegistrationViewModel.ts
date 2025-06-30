import { GenderType } from '../Enums/GenderType.enum';
import { ProviderType } from '../Enums/ProviderType.enum';

export class IRegistrationViewModel {
  UserName: string = '';
  Email: string = '';
  PhoneNumber: string = '';
  Password: string = '';
  ConfirmPassword: string = '';
  Role: string = 'Provider';

  FirstName?: string;
  LastName?: string;
  Gender?: GenderType;
  BirthDate?: string | Date;

  Street?: string;
  City?: string;
  Governorate?: string;
  Country?: string;
  // Image?: string;

  Specialization?: string;
  Bio?: string;
  ExperienceYears?: number | null;
  ProviderType?: ProviderType;
  LicenseNumber?: string;

  Availability?: string;
  EstimatedDuration?: number | null;
  Rate?: number | null;
}
