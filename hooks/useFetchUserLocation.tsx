import * as Location from 'expo-location';
import { useCallback, useMemo, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Default location centered on Armenia (Yerevan)
const DEFAULT_LOCATION: Coordinates = {
  latitude: 40.179,
  longitude: 44.499,
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
    } catch (error) {}
  }, []);

  const userLocation = useMemo(
    () => ({
      ...coordinates,
      latitudeDelta: 1.5,
      longitudeDelta: 1.5,
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
