import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React, { ReactNode } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CardProps {
  imageUrl?: string;

  onPress?: () => void;

  badge?: ReactNode;

  children: ReactNode;

  style?: object;

  imageStyle?: object;

  contentStyle?: object;
  onImageError?: () => void;
}

export const Card: React.FC<CardProps> = ({
  imageUrl,
  onPress,
  badge,
  children,
  style,
  imageStyle,
  contentStyle,
  onImageError,
}) => {
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];

  const renderCardContent = () => (
    <View style={[styles.container, style]}>
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, imageStyle]}
            resizeMode="cover"
            onError={(e) => {
              console.warn('Image loading error:', e.nativeEvent.error);
              if (onImageError) onImageError();
            }}
          />
          {badge && badge}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  return renderCardContent();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
    marginBottom: 20,
    paddingTop: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 24,
  },
});

export default Card;
