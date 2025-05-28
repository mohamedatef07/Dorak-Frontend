export interface IClientRegisterRequest {
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  Role: string;
  Email: string;
  PhoneNumber: string;
  FirstName: string | null;
  LastName: string | null;
  Gender: string | null;
  BirthDate: string | null;
  Street: string | null;
  City: string | null;
  Governorate: string | null;
  Country: string | null;
  Image: string | null;
}
