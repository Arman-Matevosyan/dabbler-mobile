import type { Cluster, Venue } from '@/types/types';

export const processMapData = (venues: Venue[] = [], clusters: Cluster[] = []) => {
  const validVenues = venues.filter(hasValidCoordinates);
  const { clusters: validClusters, venuesFromClusters } = processClusters(clusters);
  
  return {
    venues: [...validVenues, ...venuesFromClusters],
    clusters: validClusters,
  };
};

const hasValidCoordinates = (venue: Venue) => {
  const coords = venue.location?.coordinates;
  return coords?.length === 2 && 
         !isNaN(coords[0]) && 
         !isNaN(coords[1]);
};

const hasValidClusterCenter = (cluster: Cluster) => {
  return cluster?.center?.latitude !== undefined &&
         cluster?.center?.longitude !== undefined &&
         !isNaN(cluster.center.latitude) &&
         !isNaN(cluster.center.longitude);
};

const createVenueFromCluster = (cluster: Cluster): Venue => {
  return {
    ...cluster.venue!,
    id: `cluster-${cluster.id}-venue-${cluster.venue?.id || Math.random().toString(36).slice(2, 9)}`,
    navId: cluster?.venue?.id,
    location: {
      ...cluster.venue!.location,
      coordinates: [cluster.center.longitude, cluster.center.latitude],
    },
  };
};

const processClusters = (clusters: Cluster[] = []) => {
  return clusters.reduce((acc, cluster) => {
    if (!hasValidClusterCenter(cluster)) return acc;

    if (cluster.count === 1 && cluster.venue) {
      acc.venuesFromClusters.push(createVenueFromCluster(cluster));
    } else {
      acc.clusters.push(cluster);
    }
    return acc;
  }, { 
    clusters: [] as Cluster[], 
    venuesFromClusters: [] as Venue[] 
  });
};