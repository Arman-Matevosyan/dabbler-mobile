import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

interface GenericImageCarouselProps {
  images: ImageType[];
  onBackPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  isLoading?: boolean;
  showFavoriteButton?: boolean;
  showBackButton?: boolean;
  height?: number;
}

const GenericImageCarousel = ({
  images,
  onBackPress,
  onFavoritePress,
  isFavorite = false,
  isLoading = false,
  showFavoriteButton = false,
  showBackButton = false,
  height = 300,
}: GenericImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImageVisible, setZoomedImageVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const zoomedFlatListRef = useRef<FlatList>(null);
  const { width, height: screenHeight } = Dimensions.get('window');
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  const handleScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  }, [images.length]);

  const handleImagePress = useCallback(() => {
    setZoomedImageVisible(true);
  }, []);

  const handleFavoritePress = useCallback(() => {
    if (onFavoritePress) {
      onFavoritePress();
    }
  }, [onFavoritePress]);

  // Navigation function with proper index handling and infinite scrolling
  const navigateImage = useCallback((direction: 'next' | 'prev', isZoomed: boolean = false) => {
    if (images.length <= 1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = activeIndex >= images.length - 1 ? 0 : activeIndex + 1;
    } else {
      newIndex = activeIndex <= 0 ? images.length - 1 : activeIndex - 1;
    }
    
    setActiveIndex(newIndex);
    
    const listRef = isZoomed ? zoomedFlatListRef : flatListRef;
    
    if (listRef.current) {
      setTimeout(() => {
        try {
          listRef.current?.scrollToOffset({
            offset: newIndex * width,
            animated: false,
          });
        } catch (error) {
          // Silent fail
        }
      }, 10);
    }
  }, [activeIndex, images.length, width]);

  // Main carousel pan responder with improved handling
  const mainPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && 
               Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        flatListRef.current?.setNativeProps({ scrollEnabled: false });
      },
      onPanResponderMove: () => {
        // No operations during move to improve performance
      },
      onPanResponderRelease: (_, gestureState) => {
        setTimeout(() => {
          flatListRef.current?.setNativeProps({ scrollEnabled: true });
        }, 50);
        
        const { dx } = gestureState;
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            navigateImage('prev');
          } else {
            navigateImage('next');
          }
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const handleZoomedScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    
    if (currentIndex !== activeIndex && currentIndex >= 0 && currentIndex < images.length) {
      setActiveIndex(currentIndex);
    }
  }, [activeIndex, images.length]);

  // When the modal opens, ensure the right image is shown
  useEffect(() => {
    if (zoomedImageVisible && activeIndex >= 0 && activeIndex < images.length) {
      setTimeout(() => {
        try {
          zoomedFlatListRef.current?.scrollToOffset({
            offset: activeIndex * width,
            animated: false,
          });
        } catch (error) {
          // Silent fail
        }
      }, 150);
    }
  }, [zoomedImageVisible, activeIndex, images.length, width]);

  // Create a separate panResponder specifically for zoomed images with improved handling
  const zoomedPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && 
               Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        zoomedFlatListRef.current?.setNativeProps({ scrollEnabled: false });
      },
      onPanResponderMove: () => {
        // No operations during move to improve performance
      },
      onPanResponderRelease: (_, gestureState) => {
        setTimeout(() => {
          zoomedFlatListRef.current?.setNativeProps({ scrollEnabled: true });
        }, 50);
        
        const { dx } = gestureState;
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            navigateImage('prev', true);
          } else {
            navigateImage('next', true);
          }
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Navigation buttons for main carousel
  const renderNavigationButtons = () => {
    if (images.length <= 1) return null;
    
    return (
      <>
        <TouchableOpacity 
          style={[styles.carouselNavButton, { left: 8 }]}
          onPress={() => navigateImage('prev')}
        >
          <View style={styles.navButtonCircle}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.carouselNavButton, { right: 8 }]}
          onPress={() => navigateImage('next')}
        >
          <View style={styles.navButtonCircle}>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.carouselContainer, { height }]}>
      <View {...mainPanResponder.panHandlers} style={{ width, height }}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={handleImagePress}
            >
              <Image
                source={{ uri: item.url }}
                style={[styles.carouselImage, { width, height }]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => `image-${index}`}
        />
      </View>
      
      {renderNavigationButtons()}
      
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>
      
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      {showFavoriteButton && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.6}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#FF3B30' : 'white'}
            />
          )}
        </TouchableOpacity>
      )}
      
      <View style={styles.indicatorContainer}>
        {images.map((_: any, index: number) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.indicator,
              index === activeIndex ? 
                { width: 20, backgroundColor: colors.accentPrimary } : 
                { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
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
        <View style={styles.modalContainer} {...zoomedPanResponder.panHandlers}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setZoomedImageVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalNavButton, { left: 16 }]}
            onPress={() => navigateImage('prev', true)}
          >
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalNavButton, { right: 16 }]}
            onPress={() => navigateImage('next', true)}
          >
            <Ionicons name="chevron-forward" size={30} color="white" />
          </TouchableOpacity>

          <FlatList
            ref={zoomedFlatListRef}
            data={images}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={handleZoomedScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View 
                style={{ 
                  width, 
                  height: screenHeight * 0.8,
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={[styles.zoomedImage, { width, height: screenHeight * 0.8 }]}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item, index) => `zoomed-image-${index}`}
          />
          
          <View style={styles.zoomedImageCounter}>
            <Text style={styles.imageCounterText}>
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
    position: 'relative',
    backgroundColor: '#000',
  },
  carouselImage: {
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 2,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 3,
    padding: 8,
  },
  navButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    height: 4,
    borderRadius: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
    padding: 8,
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
  zoomedImageCounter: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default GenericImageCarousel; 