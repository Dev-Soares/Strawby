export type PaginatedQuery<T> = {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
