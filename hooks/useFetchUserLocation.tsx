import * as Location from 'expo-location';
import { useCallback, useMemo, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION: Coordinates = {
  latitude: 40.0691,
  longitude: 45.0382,
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
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
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
