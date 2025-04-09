import Skeleton from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  colors: any;
  profileStyles: any;
  isLoading: boolean;
  onNavigate: (path: string) => void;
}

export const ActionButtonsSkeleton = ({
  colors,
  profileStyles,
}: {
  colors: any;
  profileStyles: any;
}) => {
  return (
    <View style={profileStyles.actionButtonsContainer}>
      <View
        style={[
          profileStyles.actionButton,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Skeleton width={24} height={24} style={{ marginBottom: 8 }} />
        <Skeleton width={60} height={16} />
      </View>

      <View
        style={[
          profileStyles.actionButton,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Skeleton width={24} height={24} style={{ marginBottom: 8 }} />
        <Skeleton width={60} height={16} />
      </View>
    </View>
  );
};

export const ActionButtons = ({
  colors,
  profileStyles,
  isLoading,
  onNavigate,
}: ActionButtonsProps) => {
  if (isLoading)
    return (
      <ActionButtonsSkeleton colors={colors} profileStyles={profileStyles} />
    );

  return (
    <View style={profileStyles.actionButtonsContainer}>
      <TouchableOpacity
        style={profileStyles.actionButton}
        onPress={() => onNavigate('favorites')}
      >
        <MaterialCommunityIcons
          name="heart-outline"
          size={24}
          color={colors.accentPrimary}
        />
        <ThemedText style={profileStyles.actionButtonText}>
          Favorites
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={profileStyles.actionButton}
        onPress={() => onNavigate('checkin')}
      >
        <MaterialCommunityIcons
          name="check-outline"
          size={24}
          color={colors.accentPrimary}
        />
        <ThemedText style={profileStyles.actionButtonText}>Check-in</ThemedText>
      </TouchableOpacity>
    </View>
  );
};
