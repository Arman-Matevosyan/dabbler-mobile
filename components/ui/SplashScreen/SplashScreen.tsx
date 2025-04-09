import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onAnimationComplete 
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  // Animation values
  const logoOpacity = new Animated.Value(1); // Start with 1 to make logo visible immediately
  const logoScale = new Animated.Value(1);
  const backgroundOpacity = new Animated.Value(1);
  const containerScale = new Animated.Value(0.1);
  const containerOpacity = new Animated.Value(0); // Start with 0 to hide blue circle initially
  
  // Particles animation values
  const particles = Array.from({ length: 8 }).map(() => ({
    opacity: new Animated.Value(0),
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    scale: new Animated.Value(0.3),
    rotation: new Animated.Value(0),
  }));

  useEffect(() => {
    // Start with logo visible immediately, then circle expands from behind it
    Animated.sequence([
      // Short delay to ensure logo is rendered first
      Animated.delay(50),
      // Show and expand the blue circle
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(containerScale, {
          toValue: 1.2,
          tension: 40,
          friction: 4,
          useNativeDriver: true,
        }),
        // Slightly scale down logo as circle expands
        Animated.timing(logoScale, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Slightly contract circle to final size for bounce effect
      Animated.spring(containerScale, {
        toValue: 1,
        tension: 25,
        friction: 3,
        useNativeDriver: true,
      }),
      // Show particles
      Animated.parallel([
        // Animate particles
        ...particles.map((particle, index) => {
          const angle = (index / particles.length) * Math.PI * 2;
          const distance = 160 + Math.random() * 40;
          
          return Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.7,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(particle.position, {
              toValue: {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
              },
              tension: 80,
              friction: 4,
              useNativeDriver: true,
            }),
            Animated.spring(particle.scale, {
              toValue: 0.4 + Math.random() * 0.6,
              tension: 70,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(particle.rotation, {
              toValue: Math.random() * 4 - 2,
              duration: 400,
              useNativeDriver: true,
            }),
          ]);
        }),
      ]),
      // Pause before fade out
      Animated.delay(600),
      // Fade out everything
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call the callback when animation is complete
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: '#191E24' },
        { opacity: backgroundOpacity }
      ]}
    >      
      {/* Decorative particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            { 
              backgroundColor: index % 2 === 0 ? colors.accentPrimary : colors.accentSecondary,
              opacity: particle.opacity,
              transform: [
                ...particle.position.getTranslateTransform(),
                { scale: particle.scale },
                { rotate: particle.rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })}
              ],
            }
          ]}
        />
      ))}
      
      <View style={styles.centerContainer}>
        {/* Blue circle */}
        <Animated.View 
          style={[
            styles.logoWrapper,
            {
              opacity: containerOpacity,
              transform: [{ scale: containerScale }],
            }
          ]}
        />
        
        {/* Logo - kept at higher z-index */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          <Image
            source={require('../../../assets/images/rounded_logo.png')}
            style={styles.logo}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  centerContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
    height: 320,
  },
  logoWrapper: {
    position: 'absolute',
    width: 320,
    height: 320,
    backgroundColor: '#3B82F6',
    borderRadius: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});

export default SplashScreen; 