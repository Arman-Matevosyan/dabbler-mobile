export interface ClassSearchResult {
  id: string;
  name: string;
  time?: string;
  instructorName?: string;
  category?: string;
  spots?: number;
  scheduledSpots?: number;
  totalSpots?: number;
  date?: string;
  duration?: number;
  instructor?: {
    name: string;
    id: string;
  };
  covers?: Array<{
    url?: string;
    uri?: string;
  }>;
  venue?: {
    id: string;
    name: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  };
  categories?: string[];
  location?: {
    coordinates?: [number, number];
  };
}

export interface VenueResponse {
  classes: ClassSearchResult[];
} 