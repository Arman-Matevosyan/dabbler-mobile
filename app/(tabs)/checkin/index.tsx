import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useUserProfile } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { CheckinClassesScreen } from '@/app/(features)/checkin/CheckinClassesScreen';
import QrCheck from '@/components/svg/QrCheck';
import { useCheckIn } from '@/hooks/checkin/useCheckIn';
import { useTooltip } from '@/hooks/tooltip';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CheckinScreen() {
  const { isAuthenticated } = useUserProfile();
  const { colorScheme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const { checkInMutation, isSuccess, checkInData, isLoading } = useCheckIn();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const tooltip = useTooltip();
  const params = useLocalSearchParams();
  const urlParam = params.url as string | undefined;
  const [showCheckInData, setShowCheckInData] = useState(false);
  const didSetCheckInData = useRef(false);

  useEffect(() => {
    if (urlParam && isAuthenticated) {
      processQrData(urlParam);
    }
  }, [urlParam, isAuthenticated]);

  const processQrData = (data: string) => {
    try {
      if (data.includes('url')) {
        const urlMatch = data.match(/url=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
          const decodedUrl = decodeURIComponent(urlMatch[1]);
          checkInMutation.mutate(decodedUrl);
          return;
        }
      }

      checkInMutation.mutate(data);
    } catch (error) {
      tooltip.showError(t('checkin.scanError'), t('common.tryAgain'));
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!data) return;
    processQrData(data);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setScanning(false);
        setShowCheckInData(false);
        didSetCheckInData.current = false;
      };
    }, [])
  );

  useEffect(() => {
    if (isSuccess && checkInData && !didSetCheckInData.current) {
      tooltip.showSuccess(t('checkin.checkInSuccessful'));
      setScanning(false);

      didSetCheckInData.current = true;

      setShowCheckInData(true);
    }
  }, [isSuccess, checkInData, t, tooltip]);

  const handleScanPress = () => {
    if (!permission?.granted) {
      requestPermission();
    } else {
      setScanning(true);
    }
  };

  const handleCloseScanner = () => {
    setScanning(false);

    if (urlParam) {
      router.replace('/(tabs)/checkin');
    }
  };

  const handleBackFromClassesScreen = useCallback(() => {
    didSetCheckInData.current = false;
    setShowCheckInData(false);
  }, []);

  const renderScanner = () => {
    return (
      <View style={styles.scannerContainer}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.scanTitle}>
            {t('checkin.scanQrCode')}
          </ThemedText>
          <ThemedText style={styles.scanDescription}>
            {t('checkin.scanDescription')}
          </ThemedText>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            facing="back"
          >
            <View style={styles.overlay}>
              <View style={styles.unfocusedArea} />
              <View style={styles.focusedArea}>
                <View style={styles.scannerFrame}>
                  <View style={[styles.scannerCorner, styles.topLeftCorner]} />
                  <View style={[styles.scannerCorner, styles.topRightCorner]} />
                  <View
                    style={[styles.scannerCorner, styles.bottomLeftCorner]}
                  />
                  {isLoading && <ActivityIndicator />}
                  <View
                    style={[styles.scannerCorner, styles.bottomRightCorner]}
                  />
                </View>
              </View>
              <View style={styles.unfocusedArea} />
            </View>
          </CameraView>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.closeButton,
            { backgroundColor: colors.buttonBackground },
          ]}
          onPress={handleCloseScanner}
          accessibilityLabel={t('checkin.closeScanner')}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCheckinHome = () => {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title}>{t('checkin.title')}</ThemedText>

        <View style={styles.qrContainer}>
          <QrCheck width={width} height={height * 0.6} />
        </View>

        <TouchableOpacity
          style={[
            styles.scanButton,
            { backgroundColor: colors.buttonBackground },
          ]}
          activeOpacity={1}
          onPress={handleScanPress}
          accessibilityLabel={t('checkin.scanButton')}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoginPrompt = () => {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title}>{t('checkin.title')}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {t('checkin.loginRequired')}
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: colors.buttonBackground },
          ]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>{t('checkin.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isAuthenticated) return renderLoginPrompt();
  if (scanning) return renderScanner();
  if (showCheckInData && checkInData) {
    return (
      <CheckinClassesScreen
        data={checkInData}
        isLoading={false}
        onBackPress={handleBackFromClassesScreen}
      />
    );
  }

  return renderCheckinHome();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  illustrationContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    position: 'absolute',
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  scanDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '90%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  unfocusedArea: {
    flex: 0.15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedArea: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 10,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
});
