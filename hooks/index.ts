// Utility hooks
export { useColorScheme } from './useColorScheme';
export { useDebounce } from './useDebounce';
export { default as useFetchUserLocation } from './useFetchUserLocation';
export { default as useOptimizedStore } from './useOptimizedStore';
export { useStatusBarHeight } from './useStatusBarHeight';
export { useThemeColor } from './useThemeColor';

// Activity hooks
export { useCancelBooking, useClassBook, useFavorites } from './activity';

// Auth hooks
export * from './auth';

// Using selective content hooks to avoid naming conflicts
// Export from content
export * from './content/useCategories';
export * from './content/useCheckins';
export * from './content/useClasses';
export * from './content/useSchedules';
export * from './content/useVenues';

// Payment hooks
export * from './payment';

// User hooks
export * from './user';

// Tooltips
export * from './tooltip';
