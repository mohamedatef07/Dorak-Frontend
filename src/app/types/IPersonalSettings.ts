import { GenderType } from "../Enums/GenderType.enum";

export interface IPersonalSettings {
  FullName?: string;
  Email?: string;
  phone?: string;
  BirthDate?: string;
  image?: File | string;
}
