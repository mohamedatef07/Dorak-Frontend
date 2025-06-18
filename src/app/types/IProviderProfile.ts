import { GenderType } from "../Enums/GenderType.enum";

export interface IProviderProfile {
ID:string;
FullName:string;
 Email :string
 Phone :string
 Gender:GenderType
BirthDate :Date

 Specialization :string
 Experience :number
 MedicalLicenseNumber :string
 About :string
Image :string
}
