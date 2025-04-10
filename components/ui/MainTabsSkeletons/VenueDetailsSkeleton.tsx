import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

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

    <View
      style={[
        styles.fixedHeader,
        {
          backgroundColor: colors.primary,
          borderBottomColor: colors.divider,
        },
      ]}
    >
      <View
        style={[styles.headerButton, { backgroundColor: colors.secondary }]}
      />
      <View style={[styles.skeletonElement, { width: 120, height: 18 }]} />
      <View
        style={[styles.headerButton, { backgroundColor: colors.secondary }]}
      />
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={[styles.carouselSkeleton, { backgroundColor: colors.secondary }]}
      >
        <View style={[styles.skeletonElement, styles.skeletonImage]} />

        <View
          style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
        />
        <View
          style={[
            styles.favoriteButton,
            { backgroundColor: 'rgba(0,0,0,0.3)' },
          ]}
        />
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '70%', height: 24, marginBottom: 8 },
          ]}
        />
        <View style={styles.ratingRow}>
          <View style={[styles.skeletonElement, { width: 100, height: 16 }]} />
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '40%', height: 18, marginBottom: 12 },
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
            { width: '95%', height: 16, marginBottom: 8 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '85%', height: 16, marginBottom: 8 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '25%', height: 14, marginTop: 4 },
          ]}
        />
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '40%', height: 18, marginBottom: 12 },
          ]}
        />

        <View style={styles.infoRow}>
          <View
            style={[
              styles.skeletonElement,
              { width: 22, height: 22, borderRadius: 11 },
            ]}
          />
          <View style={styles.infoTextColumn}>
            <View
              style={[
                styles.skeletonElement,
                { width: '40%', height: 16, marginBottom: 4 },
              ]}
            />
            <View
              style={[styles.skeletonElement, { width: '80%', height: 14 }]}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.skeletonElement,
              { width: 22, height: 22, borderRadius: 11 },
            ]}
          />
          <View style={styles.infoTextColumn}>
            <View
              style={[
                styles.skeletonElement,
                { width: '30%', height: 16, marginBottom: 4 },
              ]}
            />
            <View
              style={[
                styles.skeletonElement,
                { width: '60%', height: 14, marginBottom: 4 },
              ]}
            />
            <View
              style={[styles.skeletonElement, { width: '50%', height: 14 }]}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.skeletonElement,
              { width: 22, height: 22, borderRadius: 11 },
            ]}
          />
          <View style={styles.infoTextColumn}>
            <View
              style={[
                styles.skeletonElement,
                { width: '30%', height: 16, marginBottom: 4 },
              ]}
            />
            <View
              style={[styles.skeletonElement, { width: '50%', height: 14 }]}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.skeletonElement,
              { width: 22, height: 22, borderRadius: 11 },
            ]}
          />
          <View style={styles.infoTextColumn}>
            <View
              style={[
                styles.skeletonElement,
                { width: '35%', height: 16, marginBottom: 4 },
              ]}
            />
            <View
              style={[styles.skeletonElement, { width: '70%', height: 14 }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '45%', height: 18, marginBottom: 12 },
          ]}
        />
        <View style={styles.tagsRow}>
          <View
            style={[styles.tagSkeleton, { backgroundColor: colors.secondary }]}
          />
          <View
            style={[styles.tagSkeleton, { backgroundColor: colors.secondary }]}
          />
          <View
            style={[styles.tagSkeleton, { backgroundColor: colors.secondary }]}
          />
          <View
            style={[styles.tagSkeleton, { backgroundColor: colors.secondary }]}
          />
        </View>
      </View>

      {/* Important Info Section */}
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
            { width: '100%', height: 16, marginBottom: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '95%', height: 16, marginBottom: 6 },
          ]}
        />
        <View style={[styles.skeletonElement, { width: '85%', height: 16 }]} />
        <View
          style={[
            styles.skeletonElement,
            { width: '25%', height: 14, marginTop: 8 },
          ]}
        />
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '50%', height: 18, marginBottom: 12 },
          ]}
        />
        <View
          style={[styles.planSkeleton, { backgroundColor: colors.secondary }]}
        />
        <View
          style={[styles.planSkeleton, { backgroundColor: colors.secondary }]}
        />
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.secondary, margin: 16, borderRadius: 12 },
        ]}
      >
        <View
          style={[
            styles.skeletonElement,
            { width: '70%', height: 18, marginBottom: 12 },
          ]}
        />
        <View style={styles.visitsRow}>
          <View
            style={[styles.skeletonElement, { width: '40%', height: 16 }]}
          />
          <View style={[styles.badgeSkeleton]} />
        </View>
        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: '30%',
                backgroundColor:
                  colors.skeletonBackground || 'rgba(255, 255, 255, 0.2)',
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <View style={[styles.skeletonElement, { width: 20, height: 12 }]} />
          <View style={[styles.skeletonElement, { width: 20, height: 12 }]} />
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.skeletonElement,
            { width: '40%', height: 18, marginBottom: 12 },
          ]}
        />
        <View
          style={[styles.mapSkeleton, { backgroundColor: colors.secondary }]}
        />
        <View
          style={[
            styles.skeletonElement,
            { width: '80%', height: 14, marginTop: 8 },
          ]}
        />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>

    <View
      style={[
        styles.bottomButton,
        {
          backgroundColor: colors.primary,
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
        },
      ]}
    >
      <View style={{ flex: 1 }} />
      <View
        style={[
          styles.actionButton,
          {
            backgroundColor: colors.accentPrimary || colors.skeletonBackground,
          },
        ]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    opacity: 0.5,
  },
  carouselSkeleton: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.7,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.7,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  skeletonElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoTextColumn: {
    marginLeft: 16,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagSkeleton: {
    height: 32,
    width: 100,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  planSkeleton: {
    height: 60,
    width: '100%',
    borderRadius: 8,
    marginBottom: 12,
  },
  visitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeSkeleton: {
    height: 22,
    width: 70,
    borderRadius: 11,
    backgroundColor: 'rgba(46, 125, 50, 0.5)',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapSkeleton: {
    height: 200,
    width: '100%',
    borderRadius: 12,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionButton: {
    height: 44,
    width: 120,
    borderRadius: 8,
  },
});

export default VenueDetailsSkeleton;
