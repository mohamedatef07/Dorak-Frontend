import { MenuItem } from "primeng/api";

export interface IClientReview {
  ReviewId:number
  ProviderName: string;
  Review: string;
  Rate: number;
  Date: Date;
  menuItems?: MenuItem[];
}
