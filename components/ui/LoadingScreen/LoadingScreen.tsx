import { Colors } from '@/constants/Colors';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { useLoaddingScreenStyles } from './styles';

const LoadingScreen = () => {
  const { styles, scheme } = useLoaddingScreenStyles();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/Artboard.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors[scheme].accentPrimary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
