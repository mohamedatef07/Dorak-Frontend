export interface IProviderViewModel {
  AssignmentId: number;
  ProviderId: string;
  FirstName: string;
  LastName: string;
  Specialization: string;
  Bio: string;
  ExperienceYears: number;
  LicenseNumber: string;
  Gender: number;
  Street: string | null;
  City: string | null;
  Governorate: string | null;
  Country: string | null;
  BirthDate: string;
  Image: string | null;
  Availability: string;
  EstimatedDuration: number;
  AddDate: string;
  Email: string | null;
  PhoneNumber: string | null;
  Status: number | null;
}
