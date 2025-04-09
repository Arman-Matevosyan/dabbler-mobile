import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileActionsProps {
  colors: {
    accentPrimary: string;
    textPrimary: string;
    cardBackground: string;
  };
}

interface ActionItem {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  route: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ colors }) => {
  const { styles: profileStyles } = useProfileTabStyles();
  const { t } = useTranslation();

  const actions: ActionItem[] = [
    {
      name: 'favorites',
      icon: 'heart',
      title: t('profile.favorites'),
      route: '/(features)/profile/favorites',
    },
    {
      name: 'checkin',
      icon: 'check-circle',
      title: t('profile.checkins'),
      route: '/(features)/profile/checkin',
    },
  ];

  const handleActionPress = (action: ActionItem) => {
    router.push(action.route as any);
  };

  return (
    <View style={[profileStyles.actionButtonsContainer, { marginTop: 16 }]}>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            onPress={() => handleActionPress(action)}
            key={action.name}
            activeOpacity={1}
            style={styles.actionItem}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={action.icon}
                size={28}
                color={action.name === 'favorites' ? '#3B82F6' : '#3B82F6'}
                style={styles.actionIcon}
              />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionIcon: {},
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginTop: 4,
  },
});

export default ProfileActions;
