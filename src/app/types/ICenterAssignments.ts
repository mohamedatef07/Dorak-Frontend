export interface ICenterAssignments {
  AssignmentId: number;
  CenterId: number;
  StartDate: string | Date;
  EndDate?: string | Date | null;
  IsDeleted: boolean;
}
