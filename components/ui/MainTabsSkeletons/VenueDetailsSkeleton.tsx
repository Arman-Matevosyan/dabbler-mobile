import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface VenueDetailsSkeletonProps {
  colors: {
    primary: string;
    secondary: string;
    [key: string]: string;
  };
}

export const VenueDetailsSkeleton: React.FC<VenueDetailsSkeletonProps> = ({
  colors,
}) => (
  <View style={[styles.container, { backgroundColor: colors.primary }]}>
    <StatusBar style="light" />

    <View style={styles.headerContainer}>
      <View style={[styles.headerImage, { backgroundColor: colors.secondary }]}>
        <View style={[styles.skeletonElement, styles.skeletonImage]} />
      </View>

      <View style={styles.imageBottomContent}>
        <View>
          <View
            style={[
              styles.skeletonElement,
              { width: 200, height: 24, marginBottom: 8 },
            ]}
          />
          <View style={[styles.skeletonElement, { width: 120, height: 16 }]} />
        </View>
      </View>
    </View>

    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '80%', height: 18, marginBottom: 12 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '100%', height: 16, marginBottom: 8 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '90%', height: 16, marginBottom: 8 },
          ]}
        />
        <View style={[styles.skeletonElement, { width: '70%', height: 16 }]} />
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '50%', height: 18, marginBottom: 12 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '100%', height: 120, borderRadius: 12 },
          ]}
        />
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '60%', height: 18, marginBottom: 12 },
          ]}
        />
        <View style={styles.facilitiesContainer}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.facilityItemSkeleton}>
              <View
                style={[
                  styles.skeletonElement,
                  { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
                ]}
              />
              <View
                style={[styles.skeletonElement, { width: 60, height: 12 }]}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  imageBottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  skeletonElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItemSkeleton: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default VenueDetailsSkeleton;
