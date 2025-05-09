export interface ApiResponse<T> {
  Message: string;
  Status: number;
  Data: T;
}
