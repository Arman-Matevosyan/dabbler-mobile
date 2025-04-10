import { useTheme } from '@/providers/ThemeContext';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const { colorScheme } = useTheme();
  const lottieRef = useRef<LottieView>(null);

  const backgroundOpacity = new Animated.Value(1);
  const contentOpacity = new Animated.Value(0);
  const contentScale = new Animated.Value(0.8);
  const logoScale = new Animated.Value(0.9);
  const textOpacity = new Animated.Value(0);
  const textTranslateY = new Animated.Value(20);
  const lottieOpacity = new Animated.Value(0.7);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        tension: 15,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    if (lottieRef.current) {
      setTimeout(() => {
        lottieRef.current?.play();

        Animated.timing(lottieOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 300);
    }

    setTimeout(() => {
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, 600);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          tension: 25,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);

    const dismissTimer = setTimeout(() => {
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }, 3500);

    return () => clearTimeout(dismissTimer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: '#121212' },
        { opacity: backgroundOpacity },
      ]}
    >
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        <Animated.View
          style={[styles.lottieContainer, { opacity: lottieOpacity }]}
        >
          <LottieView
            ref={lottieRef}
            source={require('../../../assets/animations/splash-animation.json')}
            style={styles.lottieAnimation}
            autoPlay={false}
            loop={false}
            speed={0.7}
          />
        </Animated.View>

        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}
        >
          <Image
            source={require('../../../assets/images/rounded_logo.png')}
            style={styles.logo}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Animated.Text style={styles.appName}>DABBLER</Animated.Text>
          <Animated.Text style={styles.tagline}>
            Art • Fitness • Lifestyle
          </Animated.Text>
        </Animated.View>
      </Animated.View>
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
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  lottieContainer: {
    position: 'absolute',
    width: Math.max(width, height),
    height: Math.max(width, height),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 100,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#FFFFFF',
    textShadowColor: 'rgba(59, 130, 246, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    marginTop: 12,
    color: '#F97316',
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default SplashScreen;
