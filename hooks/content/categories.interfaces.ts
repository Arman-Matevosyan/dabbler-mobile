export interface ICategory {
  id: string;
  name: string;
}

export interface ICategoriesResponse {
  response: ICategory[];
  metadata: Record<string, any>;
} 