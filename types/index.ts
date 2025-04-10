import type {
    IActivityBookingRequest,
    IActivityBookingResponse,
    IActivityItem,
    IActivityResponse,
    ICancelBookingRequest,
    IClassBookingRequest,
    IFavoriteRequest,
    IFavoriteResponse,
    IFavoriteVenue,
    IUserFavorites,
} from '@/types/activity.types';

import type {
    ClassDetailResponse,
    ICheckinItem,
    ICheckinsResponse,
    IClass,
    IClassAddress,
    IClassBookingResponse,
    IClassCover,
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
    IVenue,
    IVenueAddress,
    IVenueClassesResponse,
    IVenueDetail,
} from '@/types/class.types';

import type {
    ICategoriesResponse,
    ICategory,
    IContentCheckin,
    IContentCheckinsResponse,
    IPaginationMetadata,
    ISearchParams,
} from '@/types/content.types';

import type {
    IAdminSubscription,
    IAdminSubscriptionsResponse,
    IPaymentGatewayToken,
    IPaymentGatewayTokenResponse,
    IPaymentMethod,
    IPaymentMethodDetails,
    IPaymentMethodsResponse,
    IPlan,
    IPlansResponse,
    ISubscription,
    ISubscriptionCreateRequest,
    ISubscriptionCreateResponse,
    ISubscriptionCreateResponseWrapper,
    ISubscriptionPaymentMethod,
    ISubscriptionPlan,
    ISubscriptionsResponse,
    ISubscriptionUser,
} from '@/types/payment.types';

import type {
    IAddress,
    ICheckinInfo,
    ICoordinates,
    ICover,
    IDirection,
    IFullVenue,
    ILocation,
    IVenuePlan,
    IVenueResponse,
    IVenueSearchParams,
    IVenuesListResponse,
    MapCluster,
    MapSearchParams,
    MapVenue,
    MapVenueLocation,
    MapVenueWithCoordinates,
} from '@/types/venues.types';

export type {
    ClassDetailResponse,
    IActivityBookingRequest,
    IActivityBookingResponse,
    IActivityItem,
    IActivityResponse,
    IAddress,
    IAdminSubscription,
    IAdminSubscriptionsResponse,
    ICancelBookingRequest,
    ICategoriesResponse,
    ICategory,
    ICheckinInfo,
    ICheckinItem,
    ICheckinsResponse,
    IClass,
    IClassAddress,
    IClassBookingRequest,
    IClassBookingResponse,
    IClassCover,
    IClassDetailResponse,
    IClassesListResponse,
    IClassVenueInfo,
    IContentCheckin,
    IContentCheckinsResponse,
    ICoordinates,
    ICover,
    IDirection,
    IDiscoverClass,
    IDiscoverClassCheckinsResponse,
    IDiscoverClassDetailResponse,
    IDiscoverClassSchedulesResponse,
    IDiscoverClassSearchResponse,
    IDiscoverSchedulesResponse,
    IDiscoverVenueClassesResponse,
    IFavoriteRequest,
    IFavoriteResponse,
    IFavoriteVenue,
    IFullVenue,
    ILocation,
    IPaginationMetadata,
    IPaymentGatewayToken,
    IPaymentGatewayTokenResponse,
    IPaymentMethod,
    IPaymentMethodDetails,
    IPaymentMethodsResponse,
    IPlan,
    IPlansResponse,
    IScheduleItem,
    ISchedulesResponse,
    ISearchParams,
    ISubscription,
    ISubscriptionCreateRequest,
    ISubscriptionCreateResponse,
    ISubscriptionCreateResponseWrapper,
    ISubscriptionPaymentMethod,
    ISubscriptionPlan,
    ISubscriptionsResponse,
    ISubscriptionUser,
    IUserFavorites,
    IVenue,
    IVenueAddress,
    IVenueClassesResponse,
    IVenueDetail,
    IVenuePlan,
    IVenueResponse,
    IVenueSearchParams,
    IVenuesListResponse,
    MapCluster,
    MapSearchParams,
    MapVenue,
    MapVenueLocation,
    MapVenueWithCoordinates
};

    export * from '@/types/user';

const types = {
  version: '1.0.0',
};
export default types;
