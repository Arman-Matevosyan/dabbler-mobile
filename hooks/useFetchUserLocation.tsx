import * as Location from 'expo-location';
import { useCallback, useMemo, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Default location centered on Armenia (Yerevan)
const DEFAULT_LOCATION: Coordinates = {
  latitude: 40.179,  // Yerevan, Armenia
  longitude: 44.499, // Yerevan, Armenia
};

const useFetchUserLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_LOCATION);

  const fetchUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const newCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      setCoordinates((prev) => {
        if (
          prev.latitude === newCoords.latitude &&
          prev.longitude === newCoords.longitude
        ) {
          return prev;
        }
        return newCoords;
      });
    } catch (error) {
      // Fall back to Armenia if location fetch fails
      console.log('Location error, using default Armenia location');
    }
  }, []);

  const userLocation = useMemo(
    () => ({
      ...coordinates,
      latitudeDelta: 1.5,  // Zoom level to show more of Armenia
      longitudeDelta: 1.5, // Adjusted for aspect ratio
    }),
    [coordinates.latitude, coordinates.longitude]
  );

  return {
    userLocation,
    fetchUserLocation,
    isLocationAvailable: !!userLocation,
  };
};

export default useFetchUserLocation;
