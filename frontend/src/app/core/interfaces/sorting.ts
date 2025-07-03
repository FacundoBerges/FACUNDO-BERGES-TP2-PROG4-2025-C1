export type SortOptions = 'createdAt' | 'likesCount';

export type SortOrder = 'asc' | 'desc';

export interface Sorting {
  sortBy: SortOptions;
  sortOrder: SortOrder;
}
