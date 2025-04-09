export enum AuthQueryKeys {
  AUTH_STATE = 'authState',
  SESSION = 'session',
  TOKEN = 'token',
  REFRESH = 'refresh',
  USER_AVATAR = 'userAvatar',
}

export enum VenueQueryKeys {
  venuesData = 'VenuesData',
  venuesSearch = 'VenuesSearchData',
  venuesByCoords = 'VenuesDataByCord',
  venueDetails = 'VenuesDetailsData',
  venuePlans = 'VenuesPlasData',
  venuesSearchBottomSheet = 'VenuesDataBottomSheet',
  favorites = 'favorites',
}

export enum UserQueryKeys {
  userSession = 'UserSession',
  userData = 'UserData',
  checkins = 'ProfileCheckIn',
}

export enum PaymentQueryKeys {
  subscriptions = 'SubscriptionData',
  plans = 'PlansData',
  paymentMethods = 'PaymentMethodsData',
  gatewayToken = 'PaymentGatewayToken',
  paymentSuccess = 'PaymentSuccessData',
  createSubscription = 'PaymentSubData',
}

export enum ClassQueryKeys {
  classesSearch = 'ClassesSearch',
  venueClasses = 'VenueClasses',
  classDetails = 'ClassDetails',
  schedules = 'SchedulesData',
  classBooking = 'ClassBooking',
  cancelBooking = 'CancelBooking',
  discoverSearch = 'DiscoverSearch',
  discoverVenue = 'DiscoverVenue',
  discoverCheckins = 'DiscoverCheckins',
  discoverSchedules = 'DiscoverSchedules',
  discoverAllSchedules = 'DiscoverAllSchedules',
  discoverClassDetails = 'DiscoverClassDetails',
}

export enum ContentQueryKeys {
  categories = 'CategoriesData',
}

export enum ActivityQueryKeys {
  activity = 'activity',
}
