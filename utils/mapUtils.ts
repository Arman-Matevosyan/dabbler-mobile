import type { IFullVenue } from '@/types';

export interface Cluster {
  id: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
  venue?: IFullVenue;
}

export const processMapData = (
  venues: IFullVenue[] = [],
  clusters: Cluster[] = []
) => {
  const validVenues = venues.filter(hasValidCoordinates);
  const { clusters: validClusters, venuesFromClusters } =
    processClusters(clusters);

  return {
    venues: [...validVenues, ...venuesFromClusters],
    clusters: validClusters,
  };
};

const hasValidCoordinates = (venue: IFullVenue) => {
  const coords = venue.location?.coordinates;
  if (!coords || coords.length !== 2) return false;

  const lng = parseFloat(coords[0]);
  const lat = parseFloat(coords[1]);

  return !isNaN(lng) && !isNaN(lat);
};

const hasValidClusterCenter = (cluster: Cluster) => {
  return (
    cluster?.center?.latitude !== undefined &&
    cluster?.center?.longitude !== undefined &&
    !isNaN(cluster.center.latitude) &&
    !isNaN(cluster.center.longitude)
  );
};

const createVenueFromCluster = (cluster: Cluster): IFullVenue => {
  return {
    ...cluster.venue!,
    id: `cluster-${cluster.id}-venue-${
      cluster.venue?.id || Math.random().toString(36).slice(2, 9)
    }`,
    location: {
      ...cluster.venue!.location,
      coordinates: [
        cluster.center.longitude.toString(),
        cluster.center.latitude.toString(),
      ],
    },
  };
};

const processClusters = (clusters: Cluster[] = []) => {
  return clusters.reduce(
    (acc, cluster) => {
      if (!hasValidClusterCenter(cluster)) return acc;

      if (cluster.count === 1 && cluster.venue) {
        acc.venuesFromClusters.push(createVenueFromCluster(cluster));
      } else {
        acc.clusters.push(cluster);
      }
      return acc;
    },
    {
      clusters: [] as Cluster[],
      venuesFromClusters: [] as IFullVenue[],
    }
  );
};
