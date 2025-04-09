// Export all hooks
export * from './useCategories';
export * from './useCheckins';
export * from './useClasses';
export * from './useSchedules';
export * from './useVenues';

// Re-export interfaces from the interface files
// Using inline re-export to avoid conflicts
export type { ICategoriesResponse, ICategory } from './categories.interfaces';

// Classes interfaces
export type {
  ClassDetailResponse,
  ICheckinItem,
  ICheckinsResponse,
  IClass,
  IClassBookingResponse,
  IClassDetailResponse,
  IClassesListResponse,
  IClassVenueInfo,
  IDiscoverClass,
  IDiscoverClassCheckinsResponse,
  IDiscoverClassDetailResponse,
  IDiscoverClassSchedulesResponse,
  IDiscoverClassSearchResponse,
  IDiscoverSchedulesResponse,
  IDiscoverVenueClassesResponse,
  IScheduleItem,
  ISchedulesResponse,
  IVenueClassesResponse,
  IVenueDetail
} from './classes.interfaces';

// Venues interfaces
export type {
  ICheckinInfo,
  ICoordinates,
  IDirection,
  IFullVenue,
  ILocation,
  IPlan,
  IVenueResponse,
  IVenueSearchParams,
  IVenuesListResponse,
  MapCluster,
  MapSearchParams,
  MapVenue,
  MapVenueLocation,
  MapVenueWithCoordinates
} from './venues.interfaces';

