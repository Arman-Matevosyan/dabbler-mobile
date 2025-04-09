import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageType {
  url: string;
  name: string;
}

interface ImageCarouselProps {
  images: ImageType[];
  onFavoritePress: () => void;
  isFavorite: boolean;
  isLoading: boolean;
}

const ImageCarousel = ({
  images,
  onFavoritePress,
  isFavorite,
  isLoading,
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImageVisible, setZoomedImageVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const zoomedFlatListRef = useRef<FlatList>(null);
  const { width, height } = Dimensions.get('window');
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;

        if (Math.abs(dx) > 50) {
          if (dx > 0 && activeIndex > 0) {
            navigateZoomedImage('prev');
          } else if (dx < 0 && activeIndex < images.length - 1) {
            navigateZoomedImage('next');
          }
        }
      },
    })
  ).current;

  const handleScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  }, []);

  const handleImagePress = useCallback(() => {
    setZoomedImageVisible(true);
  }, []);

  const handleFavoritePress = useCallback(() => {
    onFavoritePress();
  }, [isFavorite, onFavoritePress]);

  const navigateZoomedImage = useCallback(
    (direction: 'next' | 'prev') => {
      if (direction === 'next' && activeIndex < images.length - 1) {
        setActiveIndex((prevIndex) => prevIndex + 1);
        try {
          zoomedFlatListRef.current?.scrollToIndex({
            index: activeIndex + 1,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (error) {}
      } else if (direction === 'prev' && activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1);
        try {
          zoomedFlatListRef.current?.scrollToIndex({
            index: activeIndex - 1,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (error) {}
      }
    },
    [activeIndex, images.length]
  );

  useEffect(() => {
    if (zoomedImageVisible && zoomedFlatListRef.current && activeIndex >= 0) {
      try {
        setTimeout(() => {
          zoomedFlatListRef.current?.scrollToIndex({
            index: activeIndex,
            animated: false,
            viewPosition: 0.5,
          });
        }, 100);
      } catch (error) {}
    }
  }, [zoomedImageVisible, activeIndex]);

  const handleZoomedScroll = useCallback(
    (event: any) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const currentIndex = Math.round(
        event.nativeEvent.contentOffset.x / slideSize
      );

      if (
        currentIndex !== activeIndex &&
        currentIndex >= 0 &&
        currentIndex < images.length
      ) {
        setActiveIndex(currentIndex);
      }
    },
    [activeIndex, images.length]
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={handleImagePress}>
            <Image
              source={{ uri: item.url }}
              style={[styles.carouselImage, { width }]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `image-${index}`}
      />

      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FF3B30" />
        ) : (
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={30}
            color={isFavorite ? '#FF3B30' : 'white'}
          />
        )}
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        {images.map((_: any, index: number) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.indicator,
              index === activeIndex
                ? { width: 20, backgroundColor: colors.accentPrimary }
                : { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
            ]}
          />
        ))}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bottomGradient}
      />

      <Modal
        visible={zoomedImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomedImageVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setZoomedImageVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {activeIndex > 0 && (
            <TouchableOpacity
              style={[styles.modalNavButton, { left: 16 }]}
              onPress={() => navigateZoomedImage('prev')}
            >
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
          )}

          {activeIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.modalNavButton, { right: 16 }]}
              onPress={() => navigateZoomedImage('next')}
            >
              <Ionicons name="chevron-forward" size={30} color="white" />
            </TouchableOpacity>
          )}

          <FlatList
            ref={zoomedFlatListRef}
            data={images}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeIndex}
            contentContainerStyle={{ alignItems: 'center' }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={handleZoomedScroll}
            onScroll={handleZoomedScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View
                style={{
                  width,
                  height: height * 0.8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item, index) => `modal-image-${index}`}
          />

          <View style={styles.modalImageCounter}>
            <Text style={styles.modalImageCounterText}>
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 300,
    position: 'relative',
  },
  carouselImage: {
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 10,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicator: {
    height: 4,
    width: 8,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 8,
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalImageCounter: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalImageCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ImageCarousel;
