import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AvatarProps {
  imageUri?: string | null;
  size?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  isUploading?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  size = 120,
  onPress,
  onLongPress,
  isUploading = false,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  const [modalVisible, setModalVisible] = useState(false);
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const [_, setAvatarLayout] = useState({
    x: 0,
    y: 0,
    width: size,
    height: size,
  });

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 2, size * 2],
  });

  const animatePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (imageUri) {
      setModalVisible(true);

      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (onLongPress) {
      onLongPress();
    }
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const measureAvatar = (event: any) => {
    setAvatarLayout({
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  return (
    <>
      <View
        style={{
          width: size + 20,
          height: size + 20,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: pressScale }],
          }}
        >
          <TouchableOpacity
            onPress={imageUri ? handleLongPress : handlePress}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onLongPress={handleLongPress}
            delayLongPress={200}
            activeOpacity={0.95}
            onLayout={measureAvatar}
            style={[
              styles.container,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.skeletonBackground,
              },
            ]}
          >
            {!imageUri ? (
              <View
                style={[
                  styles.placeholder,
                  { backgroundColor: colors.skeletonBackground },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={size * 0.9}
                  color={colors.accentPrimary}
                />
                <View
                  style={[
                    styles.plusIconContainer,
                    {
                      bottom: 5,
                      backgroundColor:
                        colorScheme === 'dark'
                          ? colors.cardBackground
                          : '#FFFFFF',
                      borderWidth: 2,
                      borderColor: colors.accentPrimary,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color={colors.accentPrimary}
                    style={{ fontWeight: 'bold' }}
                  />
                </View>
              </View>
            ) : (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            {isUploading && (
              <View
                style={[
                  styles.uploadingOverlay,
                  { backgroundColor: colors.text + '80' },
                ]}
              >
                <View style={styles.shimmerContainer}>
                  <View
                    style={[
                      styles.skeleton,
                      { backgroundColor: colors.skeletonBackground },
                    ]}
                  />
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        transform: [{ translateX: shimmerTranslate }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0.0)',
                        'rgba(255, 255, 255, 0.3)',
                        'rgba(255, 255, 255, 0.0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </View>
                <ActivityIndicator
                  size="small"
                  color={colors.accentPrimary}
                  style={styles.activityIndicator}
                />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {imageUri && (
          <TouchableOpacity
            onPress={handlePress}
            style={{
              position: 'absolute',
              bottom: 10,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.accentPrimary,
              borderWidth: 2,
              borderColor:
                colorScheme === 'dark' ? colors.background : '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              zIndex: 10,
            }}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalContainer} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalBackground,
              {
                opacity: modalOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.modalImageContainer,
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              },
            ]}
          >
            <Image
              source={{ uri: imageUri || undefined }}
              style={styles.modalImage}
              resizeMode="cover"
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  plusIconContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 999,
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalImageContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;
