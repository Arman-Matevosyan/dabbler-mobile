import type {
  ICategoriesResponse,
  ICategory,
} from '../hooks/content/categories.interfaces';

export interface IContentCheckin {
  id: string;
  venueId: string;
  userId: string;
  timestamp: string;
}

export interface IContentCheckinsResponse {
  response: IContentCheckin[];
  metadata: Record<string, any>;
}

export interface ISearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type { ICategoriesResponse, ICategory };

