export interface PaginationApiResponse<T> {
  Success: boolean;
  Message: string;
  Status: number;
  Data: T;
  TotalRecords: number;
  TotalPages: number;
  CurrentPage: number;
  PageSize: number;
}
