import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

interface SkeletonCardProps {
  /**
   * Card type (determines layout)
   */
  type?: 'class' | 'venue' | 'default';
  /**
   * Allow customization of the container style
   */
  style?: object;
  /**
   * Optional height of the image skeleton
   */
  imageHeight?: number;
  /**
   * Optional width of the image skeleton
   */
  imageWidth?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  type = 'default',
  style,
  imageHeight = 100,
  imageWidth = 100,
}) => {
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];

  const renderClassSkeleton = () => (
    <View style={styles.container}>
      <Skeleton
        style={[styles.image, { height: imageHeight, width: imageWidth }]}
      />
      <View style={styles.content}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.subtitle} />
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View
              style={[styles.icon, { backgroundColor: colors.border }]}
            />
            <Skeleton style={styles.detailText} />
          </View>
          
          <View style={styles.detailRow}>
            <View
              style={[styles.icon, { backgroundColor: colors.border }]}
            />
            <Skeleton style={styles.detailText} />
          </View>
          
          <View style={styles.detailRow}>
            <View
              style={[styles.icon, { backgroundColor: colors.border }]}
            />
            <Skeleton style={styles.detailText} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderVenueSkeleton = () => (
    <View style={[styles.container, styles.venueContainer]}>
      <Skeleton style={[styles.venueImage, { height: 180 }]} />
      <View style={styles.venueContent}>
        <Skeleton style={styles.title} />
        <Skeleton style={[styles.subtitle, { width: '70%' }]} />
        <Skeleton style={[styles.subtitle, { width: '50%' }]} />
        
        <View style={styles.ratingRow}>
          <Skeleton style={styles.ratingText} />
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <View
                key={`star-${i}`}
                style={[styles.star, { backgroundColor: colors.border }]}
              />
            ))}
          </View>
        </View>
      </View>
      
      <View
        style={[
          styles.favoriteButton,
          { backgroundColor: colors.border, opacity: 0.3 },
        ]}
      />
    </View>
  );

  const renderDefaultSkeleton = () => (
    <View style={styles.container}>
      <Skeleton
        style={[styles.image, { height: imageHeight, width: imageWidth }]}
      />
      <View style={styles.content}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.subtitle} />
        <Skeleton style={[styles.subtitle, { width: '60%' }]} />
      </View>
    </View>
  );

  switch (type) {
    case 'class':
      return renderClassSkeleton();
    case 'venue':
      return renderVenueSkeleton();
    default:
      return renderDefaultSkeleton();
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    height: 16,
    width: '90%',
    borderRadius: 4,
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 8,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  detailText: {
    height: 14,
    width: '70%',
    borderRadius: 4,
  },
  venueContainer: {
    flexDirection: 'column',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 0,
  },
  venueImage: {
    width: '100%',
    height: 180,
    borderRadius: 0,
    marginBottom: 16,
    marginRight: 0,
  },
  venueContent: {
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingText: {
    height: 16,
    width: 30,
    borderRadius: 4,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    zIndex: 1,
  },
});

export default SkeletonCard; 