import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageCarouselProps {
  images: Array<{
    name: string;
    url: string;
  }>;
  height?: number;
  width?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  width = SCREEN_WIDTH,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const pan = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > 50) {
        if (gestureState.dx > 0) {
          // Swipe right
          setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          );
        } else {
          // Swipe left
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        }
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  const renderImage = (isFullScreen: boolean) => {
    const imageStyle = isFullScreen
      ? styles.fullScreenImage
      : {
          ...styles.image,
          height,
          width,
        };

    return (
      <Animated.View
        style={[
          imageStyle,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: images[currentIndex].url }}
          style={[imageStyle, { resizeMode: 'cover' }]}
        />
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsFullScreen(true)}>
        {renderImage(false)}
      </TouchableOpacity>

      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsFullScreen(false)}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>
              ×
            </Text>
          </TouchableOpacity>
          {renderImage(true)}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'relative',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  counterContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
