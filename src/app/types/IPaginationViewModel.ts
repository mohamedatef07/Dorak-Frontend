export interface IPaginationViewModel<T> {
  pageNumber: number;
  pageSize: number;
  Total: number;
  Data: { $values: T[] };
}
