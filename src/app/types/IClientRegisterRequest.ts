import { GenderType } from "../Enums/GenderType.enum";

// export interface IClientRegisterRequest {
//   UserName: string;
//   Password: string;
//   ConfirmPassword: string;
//   Role: string;
//   Email: string;
//   PhoneNumber: string;
//   FirstName: string | null;
//   LastName: string | null;
//   Gender: string | null;
//   BirthDate: string | null;
//   Street: string | null;
//   City: string | null;
//   Governorate: string | null;
//   Country: string | null;
//   Image: string | null;

// }
export interface IRegistrationModel {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;

  firstName?: string;
  lastName?: string;
  gender: GenderType;
  birthDate: string; 

  street?: string;
  city?: string;
  governorate?: string;
  country?: string;
  image?: File; 

  specialization?: string;
  bio?: string;
  experienceYears?: number;
  providerType?: number;
  licenseNumber?: string;
  estimatedDuration?: number;
  rate?: number;
}
