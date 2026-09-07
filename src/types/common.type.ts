export type Nullable<T> = T | null;

export type ApiHeaders = Record<string, string>;

export type PaginationQuery = {
  page: number;
  pageSize: number;
};
