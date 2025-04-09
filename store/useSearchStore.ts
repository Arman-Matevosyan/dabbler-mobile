import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { shallow } from 'zustand/shallow';

interface SearchParams {
  limit: number;
  offset: number;
  from_date?: Date;
  to_date?: Date;
}

interface SharedSearchParams {
  query: string;
  category: string[];
}

interface VenueSearchParams extends SharedSearchParams {}
interface ClassSearchParams extends SharedSearchParams {}

interface LocationParams {
  locationLat?: number;
  locationLng?: number;
  radius: number;
}

interface SearchStore {
  sharedSearchParams: SharedSearchParams;
  venueSearchParams: VenueSearchParams;
  classSearchParams: ClassSearchParams;
  sharedLocation: LocationParams;
  venueParams: SearchParams;
  classParams: SearchParams;
  updateSharedLocation: (updates: Partial<LocationParams>) => void;
  updateVenueParams: (updates: Partial<SearchParams>) => void;
  updateClassParams: (updates: Partial<SearchParams>) => void;
  updateSharedSearchParams: (updates: Partial<SharedSearchParams>) => void;
  updateVenueSearchParams: (updates: Partial<VenueSearchParams>) => void;
  updateClassSearchParams: (updates: Partial<ClassSearchParams>) => void;
  resetClassDates: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  sharedSearchParams: {
    query: '',
    category: [],
  },
  venueSearchParams: {
    query: '',
    category: [],
  },
  classSearchParams: {
    query: '',
    category: [],
  },
  sharedLocation: {
    radius: 10000,
  },
  venueParams: {
    limit: 50,
    offset: 0,
  },
  classParams: {
    limit: 50,
    offset: 0,
  },
  updateSharedLocation: (updates) =>
    set((state) => {
      const newLocation = { ...state.sharedLocation, ...updates };
      return shallow(state.sharedLocation, newLocation)
        ? state
        : { sharedLocation: newLocation };
    }),
  updateVenueParams: (updates) =>
    set((state) => {
      const newParams = { ...state.venueParams, ...updates };
      return shallow(state.venueParams, newParams)
        ? state
        : { venueParams: newParams };
    }),
  updateClassParams: (updates) =>
    set((state) => {
      const newParams = { ...state.classParams, ...updates };
      return shallow(state.classParams, newParams)
        ? state
        : { classParams: newParams };
    }),
  updateSharedSearchParams: (updates) =>
    set((state) => {
      const newParams = { ...state.sharedSearchParams, ...updates };
      // When updating shared params, also update venue and class params
      const newVenueParams = { ...state.venueSearchParams, ...updates };
      const newClassParams = { ...state.classSearchParams, ...updates };

      return shallow(state.sharedSearchParams, newParams)
        ? state
        : {
            sharedSearchParams: newParams,
            venueSearchParams: newVenueParams,
            classSearchParams: newClassParams,
          };
    }),
  updateVenueSearchParams: (updates) =>
    set((state) => {
      const newParams = { ...state.venueSearchParams, ...updates };
      return shallow(state.venueSearchParams, newParams)
        ? state
        : { venueSearchParams: newParams };
    }),
  updateClassSearchParams: (updates) =>
    set((state) => {
      const newParams = { ...state.classSearchParams, ...updates };
      return shallow(state.classSearchParams, newParams)
        ? state
        : { classSearchParams: newParams };
    }),
  resetClassDates: () =>
    set((state) => ({
      classParams: {
        ...state.classParams,
        from_date: undefined,
        to_date: undefined,
      },
    })),
}));

export const useSearchFilters = () => {
  const { query, category } = useSearchStore(
    useShallow((state: SearchStore) => ({
      query: state.sharedSearchParams.query,
      category: state.sharedSearchParams.category,
    }))
  );

  const updateSharedSearchParams = useSearchStore(
    (state: SearchStore) => state.updateSharedSearchParams
  );

  const setQuery = (newQuery: string) => {
    updateSharedSearchParams({ query: newQuery });
  };

  const setCategory = (newCategory: string[]) => {
    updateSharedSearchParams({ category: newCategory });
  };

  return { query, category, setQuery, setCategory };
};

export const useVenueSearchFilters = () => {
  const { query, category } = useSearchStore(
    useShallow((state: SearchStore) => ({
      query: state.venueSearchParams.query,
      category: state.venueSearchParams.category,
    }))
  );

  const updateVenueSearchParams = useSearchStore(
    (state: SearchStore) => state.updateVenueSearchParams
  );

  const setQuery = (newQuery: string) => {
    updateVenueSearchParams({ query: newQuery });
  };

  const setCategory = (newCategory: string[]) => {
    updateVenueSearchParams({ category: newCategory });
  };

  return { query, category, setQuery, setCategory };
};

export const useClassSearchFilters = () => {
  const { query, category } = useSearchStore(
    useShallow((state: SearchStore) => ({
      query: state.classSearchParams.query,
      category: state.classSearchParams.category,
    }))
  );

  const updateClassSearchParams = useSearchStore(
    (state: SearchStore) => state.updateClassSearchParams
  );

  const setQuery = (newQuery: string) => {
    updateClassSearchParams({ query: newQuery });
  };

  const setCategory = (newCategory: string[]) => {
    updateClassSearchParams({ category: newCategory });
  };

  return { query, category, setQuery, setCategory };
};

export const useLocationParams = () => {
  const { locationLat, locationLng, radius } = useSearchStore(
    useShallow((state: SearchStore) => ({
      locationLat: state.sharedLocation.locationLat,
      locationLng: state.sharedLocation.locationLng,
      radius: state.sharedLocation.radius,
    }))
  );

  const updateSharedLocation = useSearchStore(
    (state: SearchStore) => state.updateSharedLocation
  );

  return {
    locationLat,
    locationLng,
    radius,
    updateLocation: updateSharedLocation,
  };
};
